import React, { useEffect, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import layout from "../../project/pages/layout";
import { Container } from "../layout/styels";
import ListTable from "../list/list";

// Memoized validation function
const validateAttributes = (attributes) => {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    return { isValid: false, error: "Attributes must be a non-empty array" };
  }

  const names = new Set();
  for (const attr of attributes) {
    if (!attr.name) {
      return { isValid: false, error: "Each attribute must have a name" };
    }
    if (names.has(attr.name)) {
      return { isValid: false, error: `Duplicate name found: ${attr.name}` };
    }
    names.add(attr.name);
  }

  return { isValid: true, error: null };
};

// Action validator
const validateActions = (actions) => {
  if (!Array.isArray(actions)) {
    console.warn("Actions should be an array");
    return false;
  }

  return true;
};

// Memoized ListTable component
const MemoizedListTable = memo(ListTable);

const DynamicList = ({
  attributes,
  listTableProps,
  title,
  actions = [], // Default empty array for actions
}) => {
  // Validate actions in development
  useEffect(() => {
    if (import.meta.env.NODE_ENV === "development") {
      const isValid = validateActions(actions);
      if (!isValid) {
        console.warn("Invalid actions provided to DynamicList");
      }
    }
  }, [actions]);

  // Memoize validation result
  const validationResult = useMemo(() => validateAttributes(attributes), [attributes]);

  // Memoize actions handlers
  const memoizedActions = useMemo(
    () =>
      actions.map((action) => ({
        ...action,
        handler: (...args) => {
          try {
            return action.handler(...args);
          } catch (error) {
            console.error(`Error in action ${action.name}:`, error);
          }
        },
      })),
    [actions]
  );

  // Memoize attributes transformation
  const processedAttributes = useMemo(
    () =>
      attributes.map((attr) => ({
        ...attr,
        id: `${attr.name}-${Date.now()}`,
      })),
    [attributes]
  );

  // Memoize listTableProps with actions
  const memoizedListTableProps = useMemo(
    () => ({
      ...listTableProps,
      actions: memoizedActions,
      attributes: processedAttributes,
    }),
    [listTableProps, memoizedActions, processedAttributes]
  );

  // Callback for table events
  const handleTableEvent = useCallback(
    (event) => {
      if (listTableProps.onEvent) {
        try {
          listTableProps.onEvent(event);
        } catch (error) {
          console.error("Error in table event handler:", error);
        }
      }
    },
    [listTableProps]
  );

  // Title effect with cleanup
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  // Development logging
  useEffect(() => {
    if (import.meta.env.NODE_ENV === "development") {
      console.log("DynamicList render", {
        attributesCount: attributes.length,
        actionsCount: actions.length,
        isValid: validationResult.isValid,
      });
    }
  }, [attributes.length, actions.length, validationResult.isValid]);

  // Validation check
  if (!validationResult.isValid) {
    console.error(validationResult.error);
    return null;
  }

  return (
    <Container className="noshadow">
      <MemoizedListTable {...memoizedListTableProps} onEvent={handleTableEvent} />
    </Container>
  );
};

DynamicList.propTypes = {
  attributes: PropTypes.array.isRequired,
  actions: PropTypes.array,
  listTableProps: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

DynamicList.defaultProps = {
  actions: [],
};

// Wrap the entire component in memo
const MemoizedDynamicList = memo(DynamicList);

// Export with Layout HOC
export default layout(MemoizedDynamicList);
