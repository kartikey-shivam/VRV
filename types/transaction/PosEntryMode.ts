export type PosEntryMode =
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "79"
    | "80"
    | "81"
    | "82"
    | "85"
    | "90"
    | "91"
    | "95"
    | "97";

export const PosEntryMode = {
    Zero: "0",
    One: "1",
    Two: "2",
    Three: "3",
    Four: "4",
    Five: "5",
    Six: "6",
    Seven: "7",
    Eight: "8",
    Nine: "9",
    Ten: "10",
    SeventyNine: "79",
    Eighty: "80",
    EightyOne: "81",
    EightyTwo: "82",
    EightyFive: "85",
    Ninety: "90",
    NinetyOne: "91",
    NinetyFive: "95",
    NinetySeven: "97",
} as const;