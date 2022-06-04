export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  bio: string;
  isAdmin: boolean;

  constructor(data: any) {
    this.id = data.id || -1;
    this.first_name = data.first_name || '';
    this.last_name = data.last_name || '';
    this.email = data.email || '';
    this.avatar = data.avatar || '';
    this.bio = data.bio || '';
    this.isAdmin = data.isAdmin || false;
  }
}
