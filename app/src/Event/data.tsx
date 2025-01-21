import {
  TableCell,
  Table,
  TableCaption,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
} from "@/Components/ui/table";
import {
  costT,
  dateT,
  eventT,
  reservationT,
  weeklyDateT,
} from "./types";

export const eventInfo = (event: eventT) => {
  if (!event) return <>Event data not found</>;

  const displayProperty = (property: keyof eventT, description: string) => {
    const dataPropertyVal = event?.[property];
    if (dataPropertyVal) {
      if (property === "endDate" || property === "startDate") {
        return (
          <>
            <TableCell className="">{description}</TableCell>
            <TableCell>{new Date(dataPropertyVal).toDateString()}</TableCell>
          </>
        );
      }

      return (
        <>
          <TableCell className="">{description}</TableCell>
          <TableCell className="">{dataPropertyVal}</TableCell>
        </>
      );
    }
  };

  return (
    <Table>
      <TableCaption>Event Information</TableCaption>
      <TableBody>
        <TableRow>{displayProperty("eventEmail", "Email")}</TableRow>
        <TableRow>{displayProperty("eventPhoneExt", "Phone Ext")}</TableRow>
        <TableRow>{displayProperty("eventPhone", "Phone")}</TableRow>
        <TableRow>{displayProperty("eventWebsite", "Website")}</TableRow>
      </TableBody>
    </Table>
  );
};

export const reservationInfo = (reservationInfo: reservationT) => {
  const displayProperty = (
    property: keyof reservationT,
    description: string
  ) => {
    const data = reservationInfo[property];
    if (data)
      return (
        <>
          <TableCell>{description}</TableCell>
          <TableCell>{data}</TableCell>
        </>
      );
  };

  return (
    <Table className="">
      <TableBody>
        <TableRow>{displayProperty("email", "Email")}</TableRow>
        <TableRow>{displayProperty("phoneExt", "Phone Ext")}</TableRow>
        <TableRow>{displayProperty("phone", "Phone")}</TableRow>
        <TableRow>{displayProperty("website", "Website")}</TableRow>
      </TableBody>
    </Table>
  );
};

export const costInfo = (cost: costT) => {
  const displayProperty = (property: keyof costT, description: string) => {
    const data = cost[property];
    if (data)
      return (
        <>
          <TableCell>{description}</TableCell>
          <TableCell>${data}</TableCell>
        </>
      );
  };

  return (
    <Table className="">
      <TableBody>
        {cost._from && cost._to ? (
          <TableRow>
            <TableCell>Range:</TableCell>
            <TableCell>{`$${cost._from} -  $${cost._to}`}</TableCell>
          </TableRow>
        ) : cost._from ? (
          <TableRow>{displayProperty("_from", "Phone Ext")}</TableRow>
        ) : cost._to ? (
          <TableRow>{displayProperty("_from", "Phone Ext")}</TableRow>
        ) : (
          ""
        )}

        <TableRow>
          {displayProperty("generalAdmission", "General Admission")}
        </TableRow>
        <TableRow>{displayProperty("adult", "Adult")}</TableRow>
        <TableRow>{displayProperty("child", "Child")}</TableRow>
        <TableRow>{displayProperty("senior", "Senior")}</TableRow>
        <TableRow>{displayProperty("student", "Student")}</TableRow>
        <TableRow>{displayProperty("youth", "Youth")}</TableRow>
      </TableBody>
    </Table>
  );
};

export const dateInfo = (
  dateObj: dateT | null,
  weeklyDate: weeklyDateT | null
) => {
  if (dateObj) {
    const startDates = dateObj.startDateTime.split(",");
    const endDates = dateObj.endDateTime.split(",");

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {startDates.map((date, index) => (
              <TableRow key={index}>
                <TableCell>{`${new Date(date).toLocaleDateString()} - ${new Date(date).toLocaleTimeString()}`}</TableCell>
                <TableCell>{`${new Date(endDates[index]).toLocaleDateString()} - ${new Date(endDates[index]).toLocaleTimeString()}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  if (weeklyDate) return <>Weekly Date lul</>;

  return <></>

  // const tailwindClass = "text-nowrap gap-3";
  // const displayProperty = (property: keyof dateT, description: string) => {
  //   const dataPropertyVal = dateObj[property];
  //   console.log(`Data obj: ${dataPropertyVal}\n`)
  //   return (
  //     <div className={tailwindClass}>
  //       <TableCell className="">{description}</TableCell>
  //       <TableCell>{new Date(dataPropertyVal).toDateString()}</TableCell>
  //     </div>
  //   );
  // }

  // return (
  //   <Table className="md:max-w-[50%]">
  //     <TableCaption>Event Information</TableCaption>
  //     <TableBody>
  //       <TableRow>{displayProperty("startDateTime", "Start Date Time")}</TableRow>
  //       <TableRow>
  //         {displayProperty("endDateTime", "End Date Time")}
  //       </TableRow>
  //       <TableRow>{displayProperty("allDay", "All Day")}</TableRow>
  //       <TableRow>
  //         {null}
  //       </TableRow>
  //     </TableBody>
  //   </Table>
};
