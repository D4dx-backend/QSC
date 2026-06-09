import { avathar } from "../../../images";
export function generateThumbnail(name = "Azhar Pallikkandy", status = null, photo = "") {
  return <span className="pic">{<img className="absolute inset-0 " src={photo?.length > 5 ? `${import.meta.env.VITE_CDN}${photo}` : avathar} alt="P"></img>}</span>;
}
