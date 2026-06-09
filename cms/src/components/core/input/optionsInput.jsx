import React, { useState, useEffect, useRef } from "react";
import { InputContainer, Input } from "./styles";
import CustomLabel from "./label";
import ErrorLabel from "./error";
import InfoBoxItem from "./info";
import Footnote from "./footnote";
import { X, Edit2, Check, GripVertical, ArrowUpAZ, ArrowDownAZ, Trash2, Search } from "lucide-react";
import styled from "styled-components";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 4px;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 13px;
  color: #1a202c;
  background: #f8fafc;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const OptionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme?.primaryBase || "#375DFB"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled(Input)`
  padding-right: ${(props) => (props.hasValue ? "80px" : "16px")};
  border-radius: 8px;
`;

const InputActions = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DragHandle = styled.div`
  cursor: grab;
  display: flex;
  align-items: center;
  color: #94a3b8;
  margin-right: 8px;

  &:hover {
    color: ${(props) => props.theme?.primaryBase || "#375DFB"};
  }
`;

const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 4px 4px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 4px;
  border-bottom: 1px solid #f1f5f9;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const SortActions = styled.div`
  display: flex;
  gap: 4px;
`;

const SortButton = styled(ActionButton)`
  padding: 4px 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  border-radius: 4px;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DeleteAllButton = styled(ActionButton)`
  padding: 4px 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  border-radius: 4px;

  &:hover {
    color: #dc2626;
    background: #fee2e2;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SearchInput = styled.div`
  position: relative;
  min-width: 150px;

  input {
    width: 100%;
    padding: 4px 8px 4px 28px;
    font-size: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    color: #1a202c;
    background: white;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme?.primaryBase || "#375DFB"};
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  svg {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #94a3b8;
  }
`;

const HeaderMiddle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin: 0 16px;
`;

const NoOptionsMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #94a3b8;
  font-size: 13px;
  background: #f8fafc;
  border-radius: 4px;
  margin-top: 4px;
`;

const SortableOptionItem = ({ option, index, onEdit, onDelete, theme }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: option });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <OptionItem ref={setNodeRef} style={style} theme={theme}>
      <div className="flex items-center">
        <DragHandle {...attributes} {...listeners} theme={theme}>
          <GripVertical size={16} />
        </DragHandle>
        <span>{option}</span>
      </div>
      <OptionActions>
        <ActionButton onClick={() => onEdit(index)} title="Edit option" theme={theme}>
          <Edit2 size={16} />
        </ActionButton>
        <ActionButton onClick={() => onDelete(index)} title="Delete option" theme={theme}>
          <Trash2 size={16} />
        </ActionButton>
      </OptionActions>
    </OptionItem>
  );
};

const OptionsInput = (props) => {
  const { name, label, required, sublabel, error, info, value, onChange, icon, placeholder = "Enter option", disabled = false, customClass = "", dynamicClass = "", theme = {} } = props;

  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const inputRef = useRef(null);
  const prevOptionsRef = useRef("");
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const processValue = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
      if (typeof val === "object") return [];
      // Handle both comma-separated and single value
      const trimmedVal = String(val).trim();
      return trimmedVal.includes(",")
        ? trimmedVal
            .split(",")
            .map((opt) => opt.trim())
            .filter(Boolean)
        : trimmedVal
        ? [trimmedVal]
        : [];
    };

    const initialOptions = processValue(value);
    setOptions(initialOptions);
  }, [value]);

  useEffect(() => {
    const optionsString = options.join(",");
    if (prevOptionsRef.current !== optionsString) {
      prevOptionsRef.current = optionsString;
      onChange(optionsString, props.id, props.type, props.sub);
    }
  }, [options, onChange, props.id, props.type, props.sub]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      if (editingIndex > -1) {
        const newOptions = [...options];
        newOptions[editingIndex] = newOption.trim();
        setOptions(newOptions);
        setEditingIndex(-1);
      } else {
        setOptions([...options, newOption.trim()]);
      }
      setNewOption("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    } else if (e.key === "Escape" && editingIndex > -1) {
      setEditingIndex(-1);
      setNewOption("");
    }
  };

  const handleEditOption = (index) => {
    setEditingIndex(index);
    setNewOption(options[index]);
    inputRef.current?.focus();
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    if (editingIndex === index) {
      setEditingIndex(-1);
      setNewOption("");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = options.indexOf(active.id);
      const newIndex = options.indexOf(over.id);

      const newOptions = arrayMove(options, oldIndex, newIndex);
      setOptions(newOptions);
    }
  };

  const handleSortAZ = () => {
    const sortedOptions = [...options].sort((a, b) => a.localeCompare(b));
    setOptions(sortedOptions);
  };

  const handleSortZA = () => {
    const sortedOptions = [...options].sort((a, b) => b.localeCompare(a));
    setOptions(sortedOptions);
  };

  const handleDeleteAll = () => {
    setOptions([]);
    setEditingIndex(-1);
    setNewOption("");
  };

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <InputContainer className={`${customClass} ${dynamicClass}`}>
      <CustomLabel name={name} label={label} required={required} sublabel={sublabel} error={error} />
      <InfoBoxItem info={info} />

      <div className="flex flex-col">
        <InputWrapper>
          <StyledInput ref={inputRef} value={newOption} onChange={(e) => setNewOption(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} theme={theme} hasValue={newOption.length > 0} className={`input ${newOption.length > 0 ? "shrink" : ""} ${icon ? "has-icon" : ""}`} />
          {icon && <span className="icon">{icon}</span>}
          {newOption && (
            <InputActions>
              <ActionButton onClick={handleAddOption} disabled={disabled || !newOption.trim()} title={editingIndex > -1 ? "Save edit" : "Add option"} theme={theme}>
                <Check size={18} />
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setNewOption("");
                  setEditingIndex(-1);
                }}
                disabled={disabled}
                title="Clear input"
                theme={theme}
              >
                <X size={18} />
              </ActionButton>
            </InputActions>
          )}
        </InputWrapper>

        {options.length > 0 ? (
          <OptionsContainer theme={theme}>
            <OptionsHeader>
              <HeaderLeft>
                <DeleteAllButton onClick={handleDeleteAll} title="Delete all options" theme={theme}>
                  <Trash2 />
                  Delete All
                </DeleteAllButton>
              </HeaderLeft>
              <HeaderMiddle>
                <SearchInput theme={theme}>
                  <Search />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={`Search ${options.length} ${options.length === 1 ? "option" : "options"}...`} />
                </SearchInput>
              </HeaderMiddle>
              <SortActions>
                <SortButton onClick={handleSortAZ} title="Sort A to Z" theme={theme}>
                  <ArrowUpAZ />
                </SortButton>
                <SortButton onClick={handleSortZA} title="Sort Z to A" theme={theme}>
                  <ArrowDownAZ />
                </SortButton>
              </SortActions>
            </OptionsHeader>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredOptions} strategy={verticalListSortingStrategy}>
                <OptionsList>
                  {filteredOptions.map((option, index) => (
                    <SortableOptionItem key={option} option={option} index={options.indexOf(option)} onEdit={handleEditOption} onDelete={handleDeleteOption} theme={theme} />
                  ))}
                </OptionsList>
              </SortableContext>
            </DndContext>
          </OptionsContainer>
        ) : (
          <NoOptionsMessage>No options added yet</NoOptionsMessage>
        )}
      </div>

      <ErrorLabel error={error} info={info} />
      <Footnote {...props} />
    </InputContainer>
  );
};

export default OptionsInput;
