import type {
  DeviceType,
  DeviceAvailability,
  ConnectionStatus,
} from "../constants/enums";

import type { ListParams } from "./common";

export interface Device {
  deviceId: string;
  deviceCode: string;
  deviceName: string;

  deviceType: DeviceType;
  availability: DeviceAvailability;
  connectionStatus: ConnectionStatus;

  ipAddress?: string;

  volume: number;
  showQueue: boolean;

  kioskTemplateId?: string;

  serviceIds: string[];
  counterIds: string[];
}

export interface DeviceListParams extends ListParams {
  availability?: DeviceAvailability;
}
