"use client";

<<<<<<< HEAD
=======
import { useState } from "react";
>>>>>>> 837b5b66a6dabeddc1ed9b7e8c0a7f1cd0d89151
import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/style.css";
import "./calendar.css";

<<<<<<< HEAD
// 受控版本：選到的日期、紅綠點資料都由外面(AccountingApp)傳進來
export default function BudgetCalendar({
  selected,
  onSelect,
  spendDays = [],
  incomeDays = [],
}: {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  spendDays?: Date[];
  incomeDays?: Date[];
}) {
=======
// 範例資料：有支出 / 有收入的日子（之後換成你自己的真實資料）
const spendDays = [4, 8, 12, 22, 29].map((d) => new Date(2025, 4, d));
const incomeDays = [15, 25].map((d) => new Date(2025, 4, d));

export default function BudgetCalendar({
  onPickDay,
}: {
  onPickDay?: (date: Date | undefined) => void;
}) {
  const [selected, setSelected] = useState<Date | undefined>(
    new Date(2025, 4, 15),
  );

>>>>>>> 837b5b66a6dabeddc1ed9b7e8c0a7f1cd0d89151
  return (
    <DayPicker
      mode="single"
      locale={zhTW}
      selected={selected}
<<<<<<< HEAD
      onSelect={onSelect}
      defaultMonth={selected}
=======
      onSelect={(day) => {
        setSelected(day);
        onPickDay?.(day);
      }}
      defaultMonth={new Date(2025, 4)}
>>>>>>> 837b5b66a6dabeddc1ed9b7e8c0a7f1cd0d89151
      showOutsideDays
      modifiers={{ spend: spendDays, income: incomeDays }}
      modifiersClassNames={{ spend: "day-spend", income: "day-income" }}
    />
  );
}
