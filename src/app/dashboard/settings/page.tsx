import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfo from "@/app/dashboard/settings/_components/PersonalInfo";
import Security from "@/app/dashboard/settings/_components/Security";
import SessionManagement from "@/app/dashboard/settings/_components/SessionManagement";
import Preference from "@/app/dashboard/settings/_components/Preference";

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
          <Text color={"primary-950"} size={"2xl"} font={"medium"}>
            Clear cache
          </Text>
          <Text color={"primary-500"} size={"sm"}>
            124 MB of temporary data
          </Text>
        </div>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="border border-error-500 hover:bg-error-500 group"
        >
          <Text
            color={"error-500"}
            size={"sm"}
            className="group-hover:text-white"
          >
            Clear
          </Text>{" "}
          <Trash2 className="w-4 h-4 text-error-500 group-hover:text-white" />
        </Button>
      </div>
    </Container>
  );
};

export default Settings;
