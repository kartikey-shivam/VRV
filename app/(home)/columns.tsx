import { ColumnDef } from "@tanstack/react-table"
import { ITransaction } from "@/types/transaction/Transaction"
import { format } from "date-fns" // You might need to install this package
import { Badge } from "@/components/ui/badge"
import { stateColors, tagsColor } from "./constants"
import { TextWithTooltip } from "@/components/custom/text-with-tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { UTCDate } from "@date-fns/utc"
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const value = row.getValue("type") as string
      return <div className="flex flex-wrap gap-1"><Badge className={tagsColor[value].badge}>{value}</Badge></div>
    },
  },
  // {
  //   accessorKey: "transactionId",
  //   header: "Transaction ID",
  // },
  {
    id: "transactionId",
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const value = row.getValue("transactionId") as string;
      return (
        <TextWithTooltip className="font-mono max-w-[85px]" text={value} />
      );
    },
  },
  // {
  //   accessorKey: "timestamp",
  //   header: "Date",
  //   cell: ({ row }) => {
  //     const value = row.getValue("timestamp") as number;
  //     return (
  //       <div className="text-xs text-muted-foreground" suppressHydrationWarning>
  //         {format(value, "LLL dd, y HH:mm")}
  //       </div>
  //     );
  //     // return (
  //     //   <div className="flex flex-col">
  //     //     <span>{format(row.getValue("timestamp"), "PP")}</span>
  //     //     <span className="text-sm text-gray-500">{format(row.getValue("timestamp"), "p")}</span>
  //     //   </div>
  //     // )
  //   },
  // },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as number;
      const date = new Date(timestamp);
      return (
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <div className="text-xs text-muted-foreground" suppressHydrationWarning>
              {format(date, "LLL dd, y HH:mm")}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            alignOffset={-4}
            className="p-2 w-auto z-10"
          >
            <dl className="flex flex-col gap-1">
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Timestamp</dt>
                <dd className="font-mono truncate">{timestamp}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">UTC</dt>
                <dd className="font-mono truncate">
                  {format(new UTCDate(date), "LLL dd, y HH:mm:ss")}
                </dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">{timezone}</dt>
                <dd className="font-mono truncate">
                  {format(date, "LLL dd, y HH:mm:ss")}
                </dd>
              </div>
            </dl>
          </HoverCardContent>
        </HoverCard>
      );
    },
    filterFn: "inDateRange",
    meta: {
      // headerClassName: "w-[182px]",
    },
  },
  {
    id: "originUserId",
    accessorKey: "originUserId",
    header: "Origin User",
    cell: ({ row }) => {
      const value = row.getValue("originUserId") as string;
      return (
        <TextWithTooltip className="font-mono max-w-[85px]" text={value} />
      );
    },
    meta: {
      label: "originUserId",
    },
  },
  {
    id: "destinationUserId",
    accessorKey: "destinationUserId",
    header: "Destination User",
    cell: ({ row }) => {
      const value = row.getValue("destinationUserId") as string;
      return (
        <TextWithTooltip className="font-mono max-w-[85px]" text={value} />
      );
    },
    meta: {
      label: "destinationUserId",
    },
  },
  {
    accessorKey: "transactionState",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("transactionState") as string
      return <div className="flex flex-wrap gap-1"><Badge className={stateColors[value].badge}>{value}</Badge></div>
    },
    // cell: ({ row }) => {
    //   const state = row.getValue("transactionState") as string
    //   return (
    //     <span className={`
    //       px-2 py-1 rounded-full text-xs font-medium
    //       ${state === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
    //       ${state === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
    //       ${state === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
    //     `}>
    //       {state}
    //     </span>
    //   )
    // },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const value = row.getValue("description") as string;
      return (
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <div className="text-xs truncate max-w-[85px]">{value}</div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            alignOffset={-4}
            className="p-2 w-auto z-10"
          >
            <div className="text-sm">{value}</div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as Array<{ key: string; value: string }>;
      if (!tags?.length) return null;

      return (
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">{tags[0].value}</Badge>
              {tags.length > 1 && (
                <Badge variant="outline">+{tags.length - 1}</Badge>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            alignOffset={-4}
            className="p-2 w-auto z-10"
          >
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag.key} variant="outline">
                  {tag.value}
                </Badge>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "currencyCode",
    header: "Currency",
    cell: ({ row }) => {
      // const tags = [
      //   {key: "test", value: "test"},
      //   {key: "test", value: "test"},
      //   {key: "test", value: "test"},
      //   {key: "test", value: "test"},
      // ]
      const details = row.getValue("originAmountDetails") as {
        transactionAmount: number;
        transactionCurrency: string;
      };
      return (
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={'outline'}
          >
            {details?.transactionCurrency}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "originAmountDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Sent" />
    ),
    enableSorting: true,
    id: "originAmountDetails",
    cell: ({ row }) => {
      const details = row.getValue("originAmountDetails") as {
        transactionAmount: number;
        transactionCurrency: string;
      };
      if (!details) return "N/A";

      return (
        <span>
          {details.transactionAmount.toFixed(2)} {details.transactionCurrency}
        </span>
      );
    },
  },
  {
    accessorKey: "destinationAmountDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Received" />
    ),
    enableSorting: true,
    id: "destinationAmountDetails",
    cell: ({ row }) => {
      const details = row.getValue("destinationAmountDetails") as {
        transactionAmount: number;
        transactionCurrency: string;
      };
      if (!details) return "N/A";

      return (
        <span>
          {details.transactionAmount.toFixed(2)} {details.transactionCurrency}
        </span>
      );
    },
  },
  {
    accessorKey: "originDeviceData",
    header: "Origin Device",
    cell: ({ row }) => {
      const device = row.getValue("originDeviceData") as {
        batteryLevel: number;
        deviceLatitude: number;
        deviceLongitude: number;
        ipAddress: string;
        deviceIdentifier: string;
        vpnUsed: boolean;
        operatingSystem: string;
        deviceMaker: string;
        deviceModel: string;
        deviceYear: string;
        appVersion: string;
      };

      if (!device) return "N/A";

      return (
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <div className="text-xs truncate max-w-[85px]">
              {device.deviceMaker} {device.deviceModel}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            alignOffset={-4}
            className="p-2 w-auto z-10"
          >
            <dl className="flex flex-col gap-1">
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Device</dt>
                <dd className="font-mono truncate">{device.deviceMaker} {device.deviceModel} ({device.deviceYear})</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">OS</dt>
                <dd className="font-mono truncate">{device.operatingSystem}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Battery</dt>
                <dd className="font-mono truncate">{device.batteryLevel}%</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-mono truncate">{device.deviceLatitude}, {device.deviceLongitude}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">IP Address</dt>
                <dd className="font-mono truncate">{device.ipAddress}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">VPN</dt>
                <dd className="font-mono truncate">{device.vpnUsed ? "Yes" : "No"}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">App Version</dt>
                <dd className="font-mono truncate">{device.appVersion}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Device ID</dt>
                <dd className="font-mono truncate">{device.deviceIdentifier}</dd>
              </div>
            </dl>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "destinationDeviceData",
    header: "Destination Device",
    cell: ({ row }) => {
      const device = row.getValue("destinationDeviceData") as {
        batteryLevel: number;
        deviceLatitude: number;
        deviceLongitude: number;
        ipAddress: string;
        deviceIdentifier: string;
        vpnUsed: boolean;
        operatingSystem: string;
        deviceMaker: string;
        deviceModel: string;
        deviceYear: string;
        appVersion: string;
      };

      if (!device) return "N/A";

      return (
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <div className="text-xs truncate max-w-[85px]">
              {device.deviceMaker} {device.deviceModel}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            alignOffset={-4}
            className="p-2 w-auto z-10"
          >
            <dl className="flex flex-col gap-1">
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Device</dt>
                <dd className="font-mono truncate">{device.deviceMaker} {device.deviceModel} ({device.deviceYear})</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">OS</dt>
                <dd className="font-mono truncate">{device.operatingSystem}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Battery</dt>
                <dd className="font-mono truncate">{device.batteryLevel}%</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-mono truncate">{device.deviceLatitude}, {device.deviceLongitude}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">IP Address</dt>
                <dd className="font-mono truncate">{device.ipAddress}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">VPN</dt>
                <dd className="font-mono truncate">{device.vpnUsed ? "Yes" : "No"}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">App Version</dt>
                <dd className="font-mono truncate">{device.appVersion}</dd>
              </div>
              <div className="flex gap-4 text-sm justify-between items-center">
                <dt className="text-muted-foreground">Device ID</dt>
                <dd className="font-mono truncate">{device.deviceIdentifier}</dd>
              </div>
            </dl>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
]