import React from "react";
import { UserRound } from "lucide-react";

import style from "./ServiceCounterCard.module.css";
import anh from "../../../assets/images/anh.png";
import { Counter } from "../../../types/serviceCounter";

interface ServiceCounterCardProps {
  counter: Counter;
  onClick: (counter: Counter) => void;
}

const ServiceCounterCard = ({ counter, onClick }: ServiceCounterCardProps) => {
  // Kiểm tra trạng thái hoạt động của quầy
  const isActive = counter.status === "active";

  return (
    <div
      className={`${style.card} ${isActive ? style.active : style.inactive}`}
      onClick={() => onClick(counter)}
    >
      {/* header */}
      <div className={style.header}>
        <div className={style.info}>
          <div className={style.title}>
            <UserRound size={20} strokeWidth={2} />
            <span className={style.name}>{counter.name}</span>
          </div>

          <span className={style.code}>{counter.code}</span>
        </div>

        {/* hình ảnh dùng chung */}
        <img src={anh} alt="Quầy dịch vụ" className={style.image} />
      </div>

      {/* danh sách dịch vụ */}
      <div className={style.services}>
        {counter.services.map((service) => (
          <span key={service.id} className={style.serviceTag}>
            {service.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ServiceCounterCard;
