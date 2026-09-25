import React, { useState } from 'react'

const Cat = () => {
    const [Rowcount , setRowcount]=useState(500);
    const [colcount , setcolcount]=useState(500);
    function Rowinc()
    {
        setRowcount(Rowcount+5);
    }
    function Rowdec()
    {
        setRowcount(Rowcount-5);
    }
    function colinc()
    {
        setcolcount(colcount+5);
    }
    function coldec()
    {
        setcolcount(colcount-5);
    }
  return (
    <div>
        <img
                style={{ width: Rowcount, height: colcount }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7UkfZFKz4GZjDbXk9XarwMzAjlmjKpNrmdm7zQLKu7A&s=10"
                alt="cat"
            />
         <br/>
        <button onClick={(Rowinc)}>row+</button>
        <button onClick={(Rowdec)}>row-</button>
        <button onClick={(colinc)}>col+</button>
        <button onClick={(coldec)}>col-</button>

    </div>
  )
}

export default Cat