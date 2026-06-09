import React, { useEffect, useRef, useState } from "react";
import { GetIcon } from "../../../../icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import { useDispatch } from "react-redux";
import { menuStatus, currentMenu, selectedMenu, selectedSubMenu, openedMenu } from "../../../../store/actions/common";

const SearchMenu = ({ tabs, onTabChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const userData = useUser();
  const dispatch = useDispatch();

  // Function to flatten tab structure for searching
  const flattenTabs = (tabs) => {
    let items = [];
    
    const processTab = (tab, parentLabel = "") => {
      // If tab has submenus, only process them
      if (tab.tabs && tab.tabs.length > 0) {
        tab.tabs.forEach((nestedTab) => {
          processTab(nestedTab, tab.title);
        });
      } 
      // If tab doesn't have submenus, add it to items
      else if (tab.title && tab.type && tab.type !== "title") {
        items.push({
          id: tab.name,
          label: tab.title,
          type: tab.type,
          icon: tab.icon,
          parentLabel: parentLabel,
          original: tab,
        });
      }
    };

    tabs.forEach((tab) => {
      processTab(tab);
    });

    return items;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const allTabItems = flattenTabs(tabs);
    const results = allTabItems.filter((item) => 
      item.label.toLowerCase().includes(term.toLowerCase()) || 
      (item.parentLabel && item.parentLabel.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(results);
    setIsSearchOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSelectTab = (item) => {
    if (onTabChange) {
      onTabChange(item.original.name);
    }
    setSearchTerm("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsExpanded(false);
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {isExpanded ? (
        <div className="flex items-center transition-all duration-200">
          <div className="relative flex items-center border border-gray-200 rounded-lg bg-white h-9 min-w-[220px]">
            <span className="absolute left-2 text-gray-400 w-[32px] h-[32px] flex items-center justify-center">
              <GetIcon icon="search" className="w-4 h-4" />
            </span>
            <input ref={inputRef} type="text" placeholder="Search tabs..." className="pl-10 pr-8 py-1.5 w-56 md:w-72 bg-transparent text-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-sm" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} onFocus={() => setIsSearchOpen(true)} style={{ height: "36px" }} />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                  inputRef.current && inputRef.current.focus();
                }}
                tabIndex={-1}
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        <button className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors" onClick={toggleSearch} aria-label="Open search">
          <GetIcon icon="search" className="w-4 h-4 text-gray-700" />
        </button>
      )}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-[38px] left-0 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-100 z-[1001] min-w-[220px]" style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)" }}>
          {searchResults.map((item) => (
            <div key={item.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2" onClick={() => handleSelectTab(item)}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <GetIcon icon={item.icon} className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[15px] text-gray-900 leading-tight">{item.label}</span>
                {item.parentLabel && <span className="text-xs text-gray-400 font-normal leading-tight">{item.parentLabel}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchMenu;
