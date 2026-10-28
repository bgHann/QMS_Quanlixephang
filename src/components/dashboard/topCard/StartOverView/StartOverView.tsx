import React from "react";
import StartCart, { ColorVariant } from "../StartCart/StartCart";
import {
  Clipboard,
  ClipboardCheck,
  ClipboardMinus,
  ClipboardX,
  LucideIcon,
} from "lucide-react";

interface CardItem {
  id: number;
  title: string;
  value: number;
  icon: LucideIcon;
  colorVariant: ColorVariant;
}

//Mock data
const MOCK_CARDS: CardItem[] = [
  {
    id: 1,
    title: "Số thứ tự đã cấp",
    value: 5329,
    icon: Clipboard,
    colorVariant: "blue",
  },
  {
    id: 2,
    title: "Số thứ tự đang chờ",
    value: 5329,
    icon: ClipboardMinus,
    colorVariant: "orange",
  },
  {
    id: 3,
    title: "Số thứ tự đã sử dụng",
    value: 5329,
    icon: ClipboardCheck,
    colorVariant: "green",
  },
  {
    id: 4,
    title: "Số thứ tự đã bỏ qua",
    value: 5329,
    icon: ClipboardX,
    colorVariant: "purple",
  },
];

export default function TopCardList() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {MOCK_CARDS.map((card) => (
        <StartCart
          key={card.id}
          title={card.title}
          value={card.value}
          iconRight={card.icon}
          colorVariant={card.colorVariant}
        />
      ))}
    </div>
  );
}
