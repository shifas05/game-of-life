import { useEffect, useState } from 'react'
import './App.css'

function App() {


   // R-Pentomino pattern.
  // const pattern = [
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 1, 1, 0],
  //   [0, 1, 1, 0, 0],
  //   [0, 0, 1, 0, 0],
  //   [0, 0, 0, 0, 0]
  // ];

    // Pulsar pattern.
  const pattern = [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
  ];

  // Creates an empty 20x20 grid.
  const emptyGrid = Array(50).fill().map(() => Array(100).fill(0));

  // Inserts the R-Pentomino pattern into the middle of the grid.
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      emptyGrid[i + 20][j + 40] = pattern[i][j];
    }
  }

  // Initializes the state with the pattern in the grid.
  const [grid, setGrid] = useState(emptyGrid);

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
          let newRow = (i + x + gridCopy.length) % gridCopy.length;
          let newCol = (j + y + gridCopy[0].length) % gridCopy[0].length;
          
          // if(newRow >= 0 && newRow < gridCopy.length && newCol >= 0 && newCol < gridCopy.length){
            liveNeighbors += gridCopy[newRow][newCol] ? 1 : 0;
          // }

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
