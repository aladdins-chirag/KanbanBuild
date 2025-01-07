import React, { useEffect } from "react";
import Column from "./Column";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragCardInfoProvider from "./context/DragCardContext";






function Dashboard() {

  return (
    <DndProvider backend={HTML5Backend}>
      <DragCardInfoProvider>
        <Column />
      </DragCardInfoProvider>
    </DndProvider>
  );
}

export default Dashboard;
