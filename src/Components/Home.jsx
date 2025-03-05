import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import react_img from '../assets/react-img.jpeg'
import '../Styles/Home.css';

const ItemTypes = {
  WIDGET: 'widget',
};

const Widget = ({ type, content, index, moveWidget, updateContent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WIDGET,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveWidget(draggedItem.index, index); 
        draggedItem.index = index;
      }
    },
  });

  const handleChange = (e) => {
    updateContent(index, e.target.value);
  };

  return (
    <div ref={(node) => drag(drop(node))} className={`widget ${isDragging ? 'dragging' : ''}`}>
      {type === 'Text' && <input type="text" value={content} onChange={handleChange} />}
      {type === 'Image' && <img src={content} alt="Widget" width="100" />}
      {type === 'Button' && <button onClick={() => alert(content)}>{content}</button>}
      {type === 'Table' && (
        <table>
          <tbody>
            {content.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const WidgetItem = ({ type }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WIDGET,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`widget-panel-item ${isDragging ? 'dragging' : ''}`}>
      {type}
    </div>
  );
};

const Home = () => {
  const [canvasWidgets, setCanvasWidgets] = useState([]);

  useEffect(() => {
    const savedWidgets = JSON.parse(localStorage.getItem('canvasWidgets'));
    if (savedWidgets) {
      setCanvasWidgets(savedWidgets);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('canvasWidgets', JSON.stringify(canvasWidgets));
  }, [canvasWidgets]);

  const addWidget = (type) => {
    const content =
      type === 'Text'
        ? 'Editable Text'
        : type === 'Image'
        ? react_img
        : type === 'Button'
        ? 'Click Me'
        : [['Row 1', 'Row 2'], ['Row 3', 'Row 4']];
    setCanvasWidgets([...canvasWidgets, { type, content }]);
  };

  const moveWidget = (from, to) => {
    const updatedWidgets = [...canvasWidgets];
    const [moved] = updatedWidgets.splice(from, 1);
    updatedWidgets.splice(to, 0, moved);
    setCanvasWidgets(updatedWidgets);
  };

  const updateContent = (index, newContent) => {
    const updatedWidgets = [...canvasWidgets];
    updatedWidgets[index].content = newContent;
    setCanvasWidgets(updatedWidgets);
  };

  const [, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    drop: (item) => {
      if (item.index === undefined) {
        addWidget(item.type);
      }
    },
  });

  return (
    <div className="home">
      <div className="widget-panel">
        <h3>Widgets</h3>
        {['Text', 'Image', 'Button', 'Table'].map((widget) => (
          <WidgetItem key={widget} type={widget} />
        ))}
      </div>
      <div className="canvas" ref={drop}>
        {canvasWidgets.map((widget, index) => (
          <Widget
            key={index}
            index={index}
            type={widget.type}
            content={widget.content}
            moveWidget={moveWidget}
            updateContent={updateContent}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
