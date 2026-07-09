"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";
import "react-day-picker/style.css";
import "./calendar.css";

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

  return (
    <DayPicker
      mode="single"
      locale={zhTW}
      selected={selected}
      onSelect={(day) => {
        setSelected(day);
        onPickDay?.(day);
      }}
      defaultMonth={new Date(2025, 4)}
      showOutsideDays
      modifiers={{ spend: spendDays, income: incomeDays }}
      modifiersClassNames={{ spend: "day-spend", income: "day-income" }}
    />
  );
}
