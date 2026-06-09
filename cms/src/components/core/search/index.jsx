import React from "react";
import { SearchInput } from "./styles";
import { GetIcon } from "../../../icons";

function Search({ className = "", theme, placeholder, value, onChange, active = false }) {
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
  };

  return (
    <SearchInput theme={theme} className={(value.length > 0 || active ? "active " : " ") + className}>
      <GetIcon icon="search" />
      <input onClick={(event) => event.stopPropagation()} name={"search-1"} type="text" autoComplete="off" placeholder={placeholder} value={value} onChange={onChange} />
      {value.length > 0 && (
        <button className="clear-button" onClick={handleClear}>
          <GetIcon icon="close" />
        </button>
      )}
    </SearchInput>
  );
}
export default Search;
