export interface userDetails {
  user: {
    _id: string;
    email: string;
    username: string;
  };
}
export interface PetsDataType {
  _id: string;
  Auth: { email: string; name: string };
  Favorites: string[];
  characteristics: { name: string };
  petImage: string[];
  petType: string;
}
