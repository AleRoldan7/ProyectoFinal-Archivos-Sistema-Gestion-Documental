import { IsBoolean } from 'class-validator';

export class StateUserDTO {

    @IsBoolean()
    state: boolean;
}