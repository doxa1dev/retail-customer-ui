export class AllRoom 
{
    room : Room[];
}

export class Room
{
    room_name : string;
    slots     : Slot[];
}
export class Slot 
{
    id               : string;
    slot_description : string;
    room_name        : string;
}

export class ActivityActive
{
    activity_id : string;
    activity_type : string;
    actyvity_advisor : string;
    activity_room_slots : string[];
}