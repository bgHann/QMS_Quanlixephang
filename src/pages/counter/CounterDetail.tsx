import React from "react";
import { useLocation } from "react-router-dom";
import { Counter } from "../../types/serviceCounter";

function CounterDetail() {
  //Lấy thông tin điều hướng của trang hiện tại
  const location = useLocation();
  //lấy thông tin quầy
  const counter = location.state as Counter | null;
  if (!counter) return <div className="">Không tìm thấy quầy</div>;
  return <div>{counter.name}</div>;
}

export default CounterDetail;
