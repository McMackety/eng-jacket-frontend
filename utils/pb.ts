import PocketBase from "pocketbase";

const pb = new PocketBase('https://jackets.chasemacdonnell.net');
pb.autoCancellation(false);

export default pb;