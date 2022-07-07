export class Event {
  event_id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: any;

  constructor(data: any) {
    this.event_id = data.id || -1;
    this.title = data.title || '';
    this.start = new Date(data.start_time);
    this.end = new Date(data.end_time);
    this.description = data.description || '';
    this.location = data.location || null;
  }

  static toRequestBody(event) {
    return {
      id: event.event_id,
      title: event?.title,
      start_time: event.start?.toISOString(),
      end_time: event.end?.toISOString(),
      description: event?.description,
    };
  }
}
