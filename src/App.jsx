import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [grid, setGrid] = useState(new Array(30).fill(null).map(() => new Array(30).fill(0).map(() => Math.round(Math.random()))));
  const [running, setRunning] = useState(false);

  const nextGridState = (gridProp) => {

    let gridCopy = gridProp.map(row => [...row]);

    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1], 
        [1, -1], [1, 0], [1, 1]
    ];

    let newGrid = gridCopy.map((row, i) => {
      return row.map((cell, j) => {
        let liveNeighbors = 0;
        directions.forEach(([x, y]) => { 
          let newRow = i + x;
          let newCol =  j+y;
          
          if(newRow >= 0 && newRow < gridCopy.length && newCol >= 0 && newCol < gridCopy.length){
            liveNeighbors += gridCopy[newRow][newCol] ? 1 : 0;
          }

        });

        if(cell && (liveNeighbors < 2 || liveNeighbors > 3)){ 
          return 0;
        } else if(!cell && liveNeighbors === 3){
          return 1;
        } else {
          return cell;
        }

      });
    });

    return newGrid;
    
  }

  const runGame = () => {
    setRunning(true);
    setGrid((currentGrid) => nextGridState(currentGrid));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      runGame();
    }, 1000);

    // clear interval on unmount
    return () => clearInterval(intervalId);
  },[]);


  const onToggleCellStatus = (rowIndex, cellIndex) => { 

    let newGrid = grid.map((row, i) => { 
      if(rowIndex === i){ 
        return row.map((cell, j) => {
          if(cellIndex === j){ 
            return cell ? 0 : 1;
          }
          return cell;
        });
      }
      return row;
    });
    
    setGrid(newGrid);
  }


  return (
    <div className='app'>
      <h1 className="header">Game of Life</h1>
      <div className='grid'>
        {grid.map((row, i) =>
          <div key={i} className='row'>
            {row.map((cell, j) => {
              return (
                <div
                  onClick={() => onToggleCellStatus(i, j)}
                  key={`${i}-${j}`}
                  className={`cell ${cell ? "alive" : "dead"}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
