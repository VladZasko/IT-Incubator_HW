import {SecurityDevicesRepository} from "../repositories/securityDevices-repository";

export class SecurityDevicesService {
    constructor(protected securityDevicesRepository:SecurityDevicesRepository) {}

    async deleteDevice(deleteData: any): Promise<boolean> {
        return await this.securityDevicesRepository.deleteDevice(deleteData)
    }
    async deleteAllDevice(deleteData: any): Promise<boolean> {
        return await this.securityDevicesRepository.deleteAllDevice(deleteData)
    }
}