import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import { bool } from 'prop-types';

export class Location {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class BlockNeighbors {
  top?: Block;
  bottom?: Block;
  left?: Block;
  right?: Block;

  constructor(top?: Block, bottom?: Block, left?: Block, right?: Block) {
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
}


export class Block {
  height = 200;
  width = 200;
  ticked = false;
  location: Location;
  content: string;
  grid?: Grid;

  constructor(location: Location, ticked: boolean = false,
              content: any, grid?: Grid) {
    this.location = location;
    this.ticked = ticked;
    this.content = content || 'blue';
    this.grid = grid;
  }

  getTopNeighbor(): Block | null | undefined {
    return this.grid?.getBlockIfExists(this.location.x  - 1, this.location.y);
  }

  getBottomNeighbor(): Block | null | undefined {
    return this.grid?.getBlockIfExists(this.location.x + 1, this.location.y);

  }
  getLeftNeighbor(): Block | null | undefined {
    return this.grid?.getBlockIfExists(this.location.x, this.location.y  - 1);
  }
  getRightNeighbor(): Block | null | undefined {
    return this.grid?.getBlockIfExists(this.location.x, this.location.y  + 1);
  }
}

export class Grid {
  width = 10;
  height = 10;
  blocks: Array<Array<Block>> = [];


  constructor(width: number = 10, height: number = 10, blocks?: Array<Array<Block>>) {
    this.width = width;
    this.height = height;

    if (blocks) {
      console.log('Constructing grid with blocks', blocks);
      this.blocks = blocks;
    } else {
      this.blocks = new Array<Array<Block>>();

      for (let x = 0; x < this.width; x++) {
        const rowItems = new Array<Block>();
        this.blocks.push(rowItems);
        for (let y = 0; y < this.height; y++) {
          rowItems.push(new Block(new Location(x, y), false, '', this))
        }
      }
    }
  }

  getBlockIfExists(x: number, y: number): Block | null {
    try {
      return this.blocks[x][y]
    } catch (e) {
      return null;
    }
  }
}


const Home: NextPage = () => {
  const [currentGrid, setCurrentGrid] = useState(new Grid());
  const [count, setCount] = useState(0);

  console.log('Current grid', {
    grid: currentGrid,
    block: currentGrid.blocks[0][0]
  })

  const updateBlock = (block: Block, event?: any) => {
    if (event && event.buttons !== 1) {
      return;
    }

    if (block.location) {

      console.log('Updating grid block', {
        block,
        gridBlock: currentGrid.blocks,
        grid: currentGrid,
        count
      });
      currentGrid.blocks[block.location.x][block.location.y] = new Block(block.location,
        !block.ticked, block.content === 'blue' ? 'red' : 'blue', currentGrid);

      console.log('Updated block', currentGrid.blocks[block.location.x][block.location.y]);

      setCurrentGrid(currentGrid);
      setCount(count+1);
    }

  }
  const renderBlock = (block: Block, index: number) => {
    let state = block.ticked ? '*' : '';
    let top = block.getTopNeighbor();
    let bottom = block.getBottomNeighbor();
    let left = block.getLeftNeighbor();
    let right = block.getRightNeighbor();

    if (block.ticked) {
      if (block.getTopNeighbor()?.ticked) {
        state += '-T'
      }

      if (block.getRightNeighbor()?.ticked) {
        state += '-R'
      }

      if (block.getBottomNeighbor()?.ticked) {
        state += '-B'
      }

      if (block.getLeftNeighbor()?.ticked) {
        state += '-L'
      }
    }

    return (<div className={styles.pipeColumn} onMouseDown={() => updateBlock(block)}
                 onMouseEnter={e => updateBlock(block, e)}
                 datacontent={block.content}
                 dataticked={`ticked=${block.ticked}`}
                 datatickedcolor={`ticked-color=${block.ticked ? 'red' : 'blue'}`}
                 style={{'backgroundColor': block.ticked ? 'red' : 'blue'}}>
      <div><p>{block.location.x}, {block.location.y}</p></div>
      <p>{state}</p>

      {/*<div>*/}
      {/*  {block?.neighbors?.top && block?.neighbors?.top.ticked && (<p>*</p>)}*/}
      {/*  <p>*/}
      {/*    {block?.neighbors?.left && block?.neighbors?.left.ticked && (<span>L</span>)} {block.location.x}, {block.location.y} - {block.ticked} - {block.content} {block?.neighbors?.right && block?.neighbors?.right.ticked && (<span>R</span>)}*/}
      {/*  </p>*/}
      {/*  {block?.neighbors?.bottom && block?.neighbors?.bottom.ticked && (<p>B</p>)}*/}
      {/*</div>*/}
    </div>)
  };

  const renderGrid = (grid: Grid) => {
    console.log('Rendering grid', grid);
    return grid.blocks
      .map((row, index) => (<div className={styles.pipeRow} key={index}>
        <div className={styles.pipeRow}>
          {row.map((col, index) => (<div key={index}>{renderBlock(col, index)}</div>))}
        </div>
      </div>))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pipe Sim</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pipe Simulator
        </h1>
        <h1>
          Shapes
        </h1>
        <div>
          <div>
            <h2>Square</h2>
            {renderGrid(currentGrid)}
          </div>
          <div className={styles.card}>
            <h2>Pipe</h2>
            <div className={styles.pipe}></div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
