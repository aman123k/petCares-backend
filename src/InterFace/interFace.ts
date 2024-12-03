export interface userDetails {
  user: {
    _id: string;
    email: string;
    username: string;
  };
}
export interface PetsdataType {
  _id: string;
  Auth: { email: string; name: string };
  Favourites: string[];
  characteristics: { name: string };
  petImage: string[];
  petType: string;
}
