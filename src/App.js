import React, { useEffect, useState } from "react";
import "./App.css";
import ListItemCard from "./Components/ListItemCard";
import Loader from "./Components/Loader";

const App = () => {
  const [lists, setLists] = useState({});
  const [selectedLists, setSelectedLists] = useState([]);
  const [tempListItems, setTempListItems] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://apis.ccbp.in/list-creation/lists");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedLists = data.lists.reduce((acc, current) => {
          const listName = `list ${current.list_number}`;
          if (!acc[listName]) {
            acc[listName] = [];
          }
          acc[listName].push(`${current.name}: ${current.description}`);
          return acc;
        }, {});
        setLists(fetchedLists);
      } catch (error) {
        console.error("Fetching lists failed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLists();
  }, []);
  

  const toggleListSelection = (listName) => {
    setSelectedLists((prev) => {
      const currentIndex = prev.indexOf(listName);
      const newSelectedLists = [...prev];
      if (currentIndex === -1) {
        newSelectedLists.push(listName);
      } else {
        newSelectedLists.splice(currentIndex, 1);
      }
      return newSelectedLists;
    });
  };

  const handleCreateListClick = () => {
    if (selectedLists.length === 2) {
      setIsCreating(true);
      setAlert(false);
    } else {
      setAlert(true);
    }
  };
  const handleCancelClick = () => {
    setIsCreating(false);
    setTempListItems([]);
  };

  const handleUpdateClick = () => {
    const newListName = `list ${Object.keys(lists).length + 1}`;
    setLists(prev => {
      const newLists = { ...prev };
      selectedLists.forEach(selectedList => {
        newLists[selectedList] = newLists[selectedList].filter(item => !tempListItems.includes(item));
      });
      newLists[newListName] = tempListItems;
      return newLists;
    });
    setIsCreating(false);
    setTempListItems([]);
    setSelectedLists([]);
  };
  const moveItem = (itemName, fromList, toList) => {
    if (toList === 'tempList') {
      setTempListItems(prevTempListItems => [...prevTempListItems, itemName]);
    } else if (fromList === 'tempList') {
      setTempListItems(prevTempListItems => prevTempListItems.filter(item => item !== itemName));
    }
    setLists(prevLists => {
      const newLists = { ...prevLists };
  
      if (fromList !== 'tempList') {
        newLists[fromList] = newLists[fromList].filter(item => item !== itemName);
      }
  
      if (toList !== 'tempList' && fromList !== toList) {
        newLists[toList] = newLists[toList].concat(itemName);
      }
  
      return newLists;
    });
  };
  return (
    <div className="app">
      <h1>List Creation</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!isCreating ? (
            <div className="actions top-actions alert">
              <button onClick={handleCreateListClick}>Create a New List</button>
              {alert ? (
                <div className="alertMsg">*You Should exactly select 2 lists to create a new list.</div>
              ) : null}
            </div>
          ) : null}
          <div className="list-container">
            {Object.entries(lists).map(([listName, items]) => {
              if (isCreating) {
                if (listName === selectedLists[0]) {
                  return (
                    <div key={listName} className="list selected">
                      <h3>{`${listName.toUpperCase()} (${items.length})`}</h3>
                      {items.map((item,index) => (
                        <ListItemCard
                         key={`${listName}-${item}-${index}`}
                          item={item}
                          onMoveLeft={null}
                          onMoveRight={() =>
                            moveItem(item, listName, "tempList")
                          }
                        />
                      ))}
                    </div>
                  );
                } else if (listName === selectedLists[1]) {
                  return null;
                } else {
                  return null;
                }
              } else {
                return (
                  <div
                    key={listName}
                    className={`list ${
                      selectedLists.includes(listName) ? "selected" : ""
                    }`}
                  >
                    <h3>{`${listName.toUpperCase()} (${items.length})`}</h3>
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedLists.includes(listName)}
                        onChange={() => toggleListSelection(listName)}
                      />
                      {items.map((item,index) => (
                        <ListItemCard
                        key={`${listName}-${item}-${index}`}
                          item={item}
                          onMoveLeft={null}
                          onMoveRight={null}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            })}
            {isCreating && (
              <div className="list temp-list">
                <h3>{`LIST ${Object.keys(lists).length + 1} (${tempListItems.length})`}</h3>
                {tempListItems.map((item) => (
                  <ListItemCard
                    key={item}
                    item={item}
                    onMoveLeft={() =>
                      moveItem(item, "tempList", selectedLists[0])
                    }
                    onMoveRight={() =>
                      moveItem(item, "tempList", selectedLists[1])
                    }
                  />
                ))}
              </div>
            )}
            {isCreating && selectedLists.length === 2 && (
              <div key={selectedLists[1]} className="list selected">
                <h3>{`${selectedLists[1].toUpperCase()} (${
                  lists[selectedLists[1]].length
                })`}</h3>
                {lists[selectedLists[1]].map((item) => (
                  <ListItemCard
                    key={item}
                    item={item}
                    onMoveLeft={() =>
                      moveItem(item, selectedLists[1], "tempList")
                    }
                    onMoveRight={null}
                  />
                ))}
              </div>
            )}
          </div>
          {isCreating ? (
            <div className="actions bottom-actions">
              <button onClick={handleCancelClick} className="cancel">
                Cancel
              </button>
              <button onClick={handleUpdateClick} className="update">
                Update
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default App;
