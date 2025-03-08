// import React, { useState, useEffect } from 'react';
// import { useDrag, useDrop } from 'react-dnd';
// import react_img from '../assets/react-img.jpeg';
// import '../Styles/Home.css';

// const ItemTypes = {
//   WIDGET: 'widget',
// };

// const Widget = ({ type, content, index, moveWidget, updateContent }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.WIDGET,
//     item: { index },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: ItemTypes.WIDGET,
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveWidget(draggedItem.index, index);
//         draggedItem.index = index;
//       }
//     },
//   });

//   const handleChange = (e) => {
//     updateContent(index, e.target.value);
//   };

//   return (
//     <div
//       ref={(node) => drag(drop(node))}
//       className={`widget ${isDragging ? 'dragging' : ''}`}
//       style={{ position: 'absolute', left: `${content.left}px`, top: `${content.top}px`, maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}
//     >
//       {type === 'Text' && <input type="text" value={content.text} onChange={handleChange} />}
//       {type === 'Image' && <img src={content.text} alt="Widget" width="100" />}
//       {type === 'Button' && <button onClick={() => alert(content.text)}>{content.text}</button>}
//       {type === 'Table' && (
//         <table>
//           <tbody>
//             {content.text.map((row, i) => (
//               <tr key={i}>
//                 {row.map((cell, j) => (
//                   <td key={j}>{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// const WidgetItem = ({ type }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.WIDGET,
//     item: { type },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} className={`widget-panel-item ${isDragging ? 'dragging' : ''}`}>
//       {type}
//     </div>
//   );
// };

// const Home = () => {
//   const [canvasWidgets, setCanvasWidgets] = useState([]);

//   useEffect(() => {
//     const savedWidgets = JSON.parse(localStorage.getItem('canvasWidgets'));
//     if (savedWidgets) {
//       setCanvasWidgets(savedWidgets);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('canvasWidgets', JSON.stringify(canvasWidgets));
//   }, [canvasWidgets]);

//   const addWidget = (type, left, top) => {
//     const content = {
//       text:
//         type === 'Text'
//           ? 'Editable Text'
//           : type === 'Image'
//           ? react_img
//           : type === 'Button'
//           ? 'Click Me'
//           : [['Row 1', 'Row 2'], ['Row 3', 'Row 4']],
//       left,
//       top,
//     };
//     setCanvasWidgets([...canvasWidgets, { type, content }]);
//   };

//   const moveWidget = (from, to, left, top) => {
//     const updatedWidgets = [...canvasWidgets];
//     if (updatedWidgets[from]) {
//       updatedWidgets[from].content.left = Math.max(0, Math.min(left, 900));
//       updatedWidgets[from].content.top = Math.max(0, Math.min(top, 400));
//       const [moved] = updatedWidgets.splice(from, 1);
//       updatedWidgets.splice(to, 0, moved);
//       setCanvasWidgets(updatedWidgets);
//     }
//   };

//   const updateContent = (index, newContent) => {
//     const updatedWidgets = [...canvasWidgets];
//     updatedWidgets[index].content.text = newContent;
//     setCanvasWidgets(updatedWidgets);
//   };

//   const [, drop] = useDrop({
//     accept: ItemTypes.WIDGET,
//     drop: (item, monitor) => {
//       const offset = monitor.getSourceClientOffset();
//       if (offset) {
//         const canvasRect = document.querySelector('.canvas').getBoundingClientRect();
//         const left = offset.x - canvasRect.left;
//         const top = offset.y - canvasRect.top;

//         if (item.index === undefined) {
//           addWidget(item.type, left, top);
//         } else {
//           moveWidget(item.index, item.index, left, top);
//         }
//       }
//     },
//   });

//   return (
//     <div className="home container">
//       <div className="widget-panel">
//         <h3>Widgets</h3>
//         {['Text', 'Image', 'Button', 'Table'].map((widget) => (
//           <WidgetItem key={widget} type={widget} />
//         ))}
//       </div>
//       <div className="canvas" ref={drop} style={{ position: 'relative', width: '900px', height: '400px', border: '1px dashed grey', overflow: 'hidden' }}>
//         {canvasWidgets.map((widget, index) => (
//           <Widget
//             key={index}
//             index={index}
//             type={widget.type}
//             content={widget.content}
//             moveWidget={moveWidget}
//             updateContent={updateContent}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import react_img from '../assets/react-img.jpeg';
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

  const handleTextChange = (e) => {
    updateContent(index, e.target.value);
  };

  const handleTableChange = (row, col, value) => {
    const updatedTable = content.text.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? value : c)) : r
    );
    updateContent(index, updatedTable);
  };

  const addRow = () => {
    const newRow = Array(content.text[0].length).fill('');
    updateContent(index, [...content.text, newRow]);
  };

  const addColumn = () => {
    const updatedTable = content.text.map((row) => [...row, '']);
    updateContent(index, updatedTable);
  };

  const removeRow = (rowIndex) => {
    if (content.text.length > 1) {
      updateContent(index, content.text.filter((_, i) => i !== rowIndex));
    }
  };

  const removeColumn = (colIndex) => {
    if (content.text[0].length > 1) {
      const updatedTable = content.text.map((row) => row.filter((_, i) => i !== colIndex));
      updateContent(index, updatedTable);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`widget ${isDragging ? 'dragging' : ''}`}
      style={{ position: 'absolute', left: `${content.left}px`, top: `${content.top}px`, maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}
    >
      {type === 'Text' && <input type="text" value={content.text} onChange={handleTextChange} />}
      {type === 'Image' && <img src={content.text} alt="Widget" width="100" />}
      {type === 'Button' && <button onClick={() => alert(content.text)}>{content.text}</button>}
      {type === 'Table' && (
        <div>
          <table border="1">
            <tbody>
              {content.text.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleTableChange(i, j, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => removeRow(i)}>- Row</button>
                  </td>
                </tr>
              ))}
              <tr>
                {content.text[0].map((_, j) => (
                  <td key={j}>
                    <button onClick={() => removeColumn(j)}>- Col</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className='btn-arrange'>
            <button onClick={addRow}>+ Row</button>
            <button onClick={addColumn}>+ Column</button>
          </div>
        </div>
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

  const addWidget = (type, left, top) => {
    const content = {
      text:
        type === 'Text'
          ? 'Editable Text'
          : type === 'Image'
          ? react_img
          : type === 'Button'
          ? 'Click Me'
          : [['Row 1', 'Row 2'], ['Row 3', 'Row 4']], // Default table
      left,
      top,
    };
    setCanvasWidgets([...canvasWidgets, { type, content }]);
  };

  const moveWidget = (from, to, left, top) => {
    const updatedWidgets = [...canvasWidgets];
    if (updatedWidgets[from]) {
      updatedWidgets[from].content.left = Math.max(0, Math.min(left, 900));
      updatedWidgets[from].content.top = Math.max(0, Math.min(top, 400));
      const [moved] = updatedWidgets.splice(from, 1);
      updatedWidgets.splice(to, 0, moved);
      setCanvasWidgets(updatedWidgets);
    }
  };

  const updateContent = (index, newContent) => {
    const updatedWidgets = [...canvasWidgets];
    updatedWidgets[index].content.text = newContent;
    setCanvasWidgets(updatedWidgets);
  };

  const [, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        const canvasRect = document.querySelector('.canvas').getBoundingClientRect();
        const left = offset.x - canvasRect.left;
        const top = offset.y - canvasRect.top;

        if (item.index === undefined) {
          addWidget(item.type, left, top);
        } else {
          moveWidget(item.index, item.index, left, top);
        }
      }
    },
  });

  return (
    <div className="home container">
      <div className="widget-panel">
        <h3>Widgets</h3>
        {['Text', 'Image', 'Button', 'Table'].map((widget) => (
          <WidgetItem key={widget} type={widget} />
        ))}
      </div>
      <div className="canvas" ref={drop} style={{ position: 'relative', width: '900px', height: '400px', border: '1px dashed grey', overflow: 'hidden' }}>
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
