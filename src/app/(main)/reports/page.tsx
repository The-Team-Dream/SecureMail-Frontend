import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { stats, listItems } from "./data";
import { ReportStatCard } from "./ReportStatCard";
import { ReportListItem } from "./ReportListItem";

export default function Reports() {
  return (
    <Container>
      <div className="flex flex-col gap-6">

        {/* Header */}
        <Text size="2xl" font="medium">
          Good Morning, Mohamed
        </Text>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ id, ...props }) => (
            <ReportStatCard key={id} {...props} />
          ))}
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-4 mt-2">
          {listItems.map(({ id, ...props }) => (
            <ReportListItem key={id} {...props} />
          ))}
        </div>

      </div>
    </Container>
  );
}
