export class Activity
{
    id              : string;
    title           : string;
    uri             : string;
    activity_date   : string;
    start_time      : string;
    status          : string;
    end_time        : string;
    created_by      : string;
    type            : string;
    privacy         : string;
    capacity        : number;
    address_unit    : string;
    address_city    : string;
    description     : string;
    notes           : string;
    cover_photo_key : string;
    roomId          : string;
    address         : Address;
    advisor         : string;
    offices         : Office[];
    attendees       : Array<Attendee> =[];
    bookingSlots    : OfficeRoomSlotBooking[];
    room_name       : string;
}

export class Attendee
{
    id            : string;
    name          : string;
    firstName     : string;
    lastName      : string;
    preferredName : string;
    email         : string;
    phone_number  : string;
    phone         : string;
    dial_code     : string;
    attendance    : string;
    notes         : string;
    questionnaire1: string;
    questionnaire2: string;
    STT           : number;
    showView      : boolean;
    date          : string;
}

export class AttendeeDto
{
    activity_id : number;
    first_name: string;
    preferred_name: string;
    email: string;
    phone_dial_code: string;
    phone_number: string;
    notes: string;
    is_invited: boolean;
    is_attended: boolean;
}

export class ActivityRoom {
    id: string;
    entityId: string;
    roomName: string;
    description: string;
    roomCapacity: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    roomAddress: RoomAddress
}

export class RoomAddress {
    id: string;
    createdOn: string;
    isDeleted: boolean;
    updatedOn: string;
    addrLabel: string;
    addrLine1: string;
    addrLine2: string;
    addrLine3: string;
    city: string;
    countryCode: string;
    globalAddrId: string;
    postalCode: number;
    createdById: string;
    updatedById: string;
    doxaEntityId:string;
    etVendorId: string;
    latitude: string;
    longitude: string;
}

export class TimeSlot {
    id: string;
    officeRoomId: number;
    slotNumber: number;
    slotDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    startTime: string;
    endTime: string;
}
export class Address {
    id: string;
    postalCode: number;
    cityState: string;
    detailAddress: string;
    unitNumber: string;
    countryCode: string;
    createdAt: string;
    updatedAt: string;
    show_address : string;
}
export class Office {
    id: number;
    officeRoomSlotId: number;
    status: string;
    bookingDate: string;
    createdAt: string;
    updatedAt: string;
    officeRoomSlot: OfficeRoomSlot
}

export class OfficeRoomSlot {
    id: number;
    officeRoomId: string;
    slotNumber: number;
    slotDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    startTime: string;
    endTime: string;
}

export class OfficeRoomSlotBooking
{
    id: number;
    officeRoomId: OfficeRoomSlot;
    slotNumber: number;
    slotDescription: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    startTime: string;
    endTime: string;
}