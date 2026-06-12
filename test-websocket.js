const axios = require('axios');
const { io } = require('socket.io-client');

// Retrieve credentials from command line arguments or environment variables
const args = process.argv.slice(2);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const ADMIN_EMAIL = args[0] || process.env.ADMIN_EMAIL || 'admin@securemail.local';
const ADMIN_PASSWORD = args[1] || process.env.ADMIN_PASSWORD || 'Admin123!';
console.log("Start")
async function run() {
  console.log('=== SecureMail WebSocket Diagnostics Tool ===');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Email to test: ${ADMIN_EMAIL}`);
  console.log('---------------------------------------------');

  if (args.length < 2 && ADMIN_EMAIL === 'admin@securemail.local') {
    console.log('💡 Tip: You can run this script with custom credentials:');
    console.log('   node test-websocket.js <email> <password>\n');
  }

  // 1. Authenticate to get JWT token
  let token;
  try {
    console.log('[1] Authenticating with backend...');
    const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    const resData = loginRes.data;
    if (resData && resData.success && resData.data && resData.data.token) {
      token = resData.data.token;
      console.log('✅ Authentication successful!');
    } else {
      console.error('❌ Authentication failed. Response:', JSON.stringify(resData));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Auth Request Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }

  // 2. Connect via Socket.IO
  console.log('\n[2] Connecting to WebSocket server...');
  const socket = io(BACKEND_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });

  const receivedEvents = [];

  // Register connection events
  socket.on('connect', () => {
    console.log(`✅ WebSocket Connected! Connection ID (Socket ID): ${socket.id}`);
    
    // Now fetch mailboxes and trigger sync
    fetchMailboxesAndTriggerSync(token);
  });

  socket.on('connect_error', (err) => {
    console.error(`❌ WebSocket Connection Error: ${err.message}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`ℹ️ WebSocket Disconnected. Reason: ${reason}`);
  });

  // Register message events
  const targetEvents = [
    'new-email',
    'new_email_arrived',
    'email_analyzed',
    'email-sent',
    'notification',
    'mailbox_sync_complete',
    'mailbox-sync-failed',
    'security-alert',
    'mailbox-status'
  ];

  targetEvents.forEach(eventName => {
    socket.on(eventName, (data) => {
      console.log(`\n🔥 [EVENT] Received '${eventName}' event at ${new Date().toLocaleTimeString()}:`);
      console.log(JSON.stringify(data, null, 2));
      receivedEvents.push({ event: eventName, data, time: new Date() });
    });
  });

  // A wild-card listener to debug any unmapped events
  socket.onAny((eventName, ...args) => {
    if (!targetEvents.includes(eventName)) {
      console.log(`\n🔔 [OTHER EVENT] Received '${eventName}' at ${new Date().toLocaleTimeString()}:`);
      console.log(JSON.stringify(args, null, 2));
      receivedEvents.push({ event: eventName, data: args, time: new Date() });
    }
  });

  // 3. Helper to fetch mailboxes and trigger a sync
  async function fetchMailboxesAndTriggerSync(authToken) {
    try {
      console.log('\n[3] Fetching user mailboxes...');
      const mailboxesRes = await axios.get(`${BACKEND_URL}/mailboxes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const mailboxes = mailboxesRes.data.data?.mailboxes || mailboxesRes.data.mailboxes || mailboxesRes.data;
      if (!Array.isArray(mailboxes) || mailboxes.length === 0) {
        console.log('ℹ️ No mailboxes found for this user. Connect a mailbox in the UI first.');
        return;
      }

      console.log(`Found ${mailboxes.length} mailbox(es):`);
      mailboxes.forEach(m => {
        console.log(`- ID: ${m.id}, Email Address: ${m.emailAddress || m.email}, Sync Status: ${m.status}`);
      });

      // Let's trigger sync on the first mailbox
      const targetMailbox = mailboxes[0];
      const mailboxId = targetMailbox.id;
      console.log(`\n[4] Triggering manual synchronization for mailbox ID: ${mailboxId}...`);
      
      const syncRes = await axios.post(`${BACKEND_URL}/mailboxes/${mailboxId}/sync`, {}, {
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }
      });
      console.log(`Sync POST request status: ${syncRes.status} (Success)`);
      console.log('\n⏳ Listening for real-time WebSocket events. Please wait...');
      console.log('If the backend is working correctly, you should see "mailbox_sync_complete"');
      console.log('and "new-email" / "new_email_arrived" events if there are new emails.\n');
      
    } catch (error) {
      console.error('❌ Error during API operations:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }

  // Keep running for 40 seconds to capture events, then clean up and report
  setTimeout(() => {
    console.log('\n---------------------------------------------');
    console.log('=== Diagnostics Summary ===');
    console.log(`Total events received: ${receivedEvents.length}`);
    if (receivedEvents.length === 0) {
      console.log('❌ Result: NO EVENTS RECEIVED.');
      console.log('   This indicates either:');
      console.log('   1. The backend did not broadcast any events.');
      console.log('   2. The websocket server is not dispatching updates to this client connection.');
    } else {
      console.log('✅ Result: EVENTS RECEIVED.');
      console.log('Received events list:');
      receivedEvents.forEach((item, index) => {
        console.log(`   ${index + 1}. [${item.time.toLocaleTimeString()}] Event: '${item.event}'`);
      });
      
      const hasNewEmail = receivedEvents.some(e => e.event === 'new-email' || e.event === 'new_email_arrived');
      if (hasNewEmail) {
        console.log('   🎉 Found new email events! The backend IS broadcasting.');
        console.log('   The issue lies in the frontend not listening, or cache invalidation not triggering React Query updates.');
      } else {
        console.log('   ⚠️ Received sync events, but NO new email events.');
      }
    }
    
    console.log('\nClosing socket connection...');
    socket.disconnect();
    process.exit(0);
  }, 40000);
}

run();
