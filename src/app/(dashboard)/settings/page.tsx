import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfo from "@/_components/dashboard/settings/PersonalInfo";
import Security from "@/_components/dashboard/settings/Security";
import SessionManagement from "@/_components/dashboard/settings/SessionManagement";
import Preference from "@/_components/dashboard/settings/Preference";

const Settings = () => {
  return (
    <Container>
      <PersonalInfo />
      <hr className="bg-primary-100" />
      <Security />
      <hr className="bg-primary-100" />
      <SessionManagement />
      <hr className="bg-primary-100" />
      <Preference />
      <hr className="bg-primary-100" />
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-col gap-2">
          <Text color={"primary-950"} size={"3xl"} font={"medium"}>
            Clear cache
          </Text>
          <Text color={"primary-500"}>124 MB of temporary data</Text>
        </div>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="border border-error-500 hover:bg-error-500"
        >
          <Text color={"error-500"} size={"sm"}>
            Clear
          </Text>{" "}
          <Trash2 className="w-4 h-4 text-error-500" />
        </Button>
      </div>
    </Container>
  );
};

export default Settings;
