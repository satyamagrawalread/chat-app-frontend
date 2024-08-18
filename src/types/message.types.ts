export interface Message {
  id: number;
  text: string;
  sender: {
    id: number;
  };
  receiver: {
    id: number;
  };
  time: string;
}
