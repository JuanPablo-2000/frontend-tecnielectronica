import { IconButton, InputBase, Paper } from '@mui/material'
import SearchIcon from "@mui/icons-material/Search";
import { ISearch } from '../interfaces/Modal';

export const Search = ({
  placeholder,
  handleOnChange,
  handleOnKeyPress,
  valueSearch,
  searchBy
} : ISearch) => {
  return (
    <>
      <div className='flex-title'>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            position: "relative",
            width: 400,
            height: 40,
          }}
        >
          <InputBase 
            value={valueSearch}
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyPress}
          />
          <IconButton
            type='button'
            aria-label='searh'
            onClick={searchBy}
            sx={{ p: "20px", left: 10 }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
    </>
  )
}
