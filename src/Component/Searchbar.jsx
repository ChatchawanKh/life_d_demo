import React, { useState, useEffect } from 'react';
import { Box, Stack, Autocomplete, TextField, Input } from '@mui/material';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function Searchbar() {
    const [jsonResult, setJsonResult] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://api.sphere.gistda.or.th/services/search/suggest?keyword=${input}&limit=5&sdx=true&key=test2022',
                // 'https://api.sphere.gistda.or.th/services/search/suggest?keyword=${input}&limit=5&sdx=true&key=test2022'
            );
            const json = await response.json();
            setJsonResult(json.data);
        }
        fetchData();
    }, []);
    console.log(jsonResult);

    return (
        <div style={{
            position: 'absolute',
            right: '1rem',
            top: '1em',
            zIndex: '10'
        }}>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)'
                }}
            >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    id='result'
                    sx={{ ml: 1, flex: 1, fontFamily: 'Prompt' }}
                    placeholder="ระบุคำค้นหา เช่น ชื่อสถานที่"
                    inputProps={{ 'aria-label': 'ระบุคำค้นหา เช่น ชื่อสถานที่' }}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            {option.name}
                        </Box>
                    )}
                />
                {/* <Autocomplete
                    id="place"
                    getOptionLabel={(option) => option.name}
                    options={jsonResult}
                    sx={{ width: 300 }}
                    noOptionsText="ไม่พบข้อมูลที่ท่านต้องการ"
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            {option.name}
                        </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                /> */}
            </Paper>
        </div>
    );
}


// import React, { useState, useEffect } from 'react';
// import { Box, Stack, Autocomplete, TextField } from '@mui/material';


// function Searchbar() {
//     const [jsonResult, setJsonResult] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const response = await fetch(
//                 // 'https://api.sphere.gistda.or.th/services/search/suggest?keyword=ศูนย์ราชการ&limit=5&sdx=true&key=test2022',
//                 'https://api.sphere.gistda.or.th/services/search/suggest?keyword=${input}&limit=5&sdx=true&key=test2022'
//             );
//             const json = await response.json();
//             setJsonResult(json.data);
//         }
//         fetchData();
//     }, []);

// console.log(jsonResult);

//     return (
//         <div style={{ position: 'absolute', right: '1rem', top: '1rem', zIndex: 10 }}>
//             <Stack sx={{ width: 300 }}>
//                 <Autocomplete
//                     id="place"
//                     getOptionLabel={(option) => option.name}
//                     options={jsonResult}
//                     sx={{ width: 300 }}
//                     noOptionsText="ไม่พบข้อมูลที่ท่านต้องการ"
//                     renderOption={(props, option) => (
//                         <Box component="li" {...props} key={option.id}>
//                             {option.name}
//                         </Box>
//                     )}
//                     renderInput={(params) => <TextField {...params} label="Search" />}
//                 />
//             </Stack>
//         </div>
//     );
// }

// export default Searchbar;




