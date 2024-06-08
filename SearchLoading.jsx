import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { MdSearch } from 'react-icons/md';
import classes from './SearchLoading.module.css';
import useDebounce from '../../hooks/useDebouce';
import { Link } from 'react-router-dom';
import { ListSceleton } from '../Loaders/Loaders';

const SearchLoading = ({
  loading,
  searchResults,
  searchAction,
  selectAction,
  getLink,
  placeholder = ''
}) => {
  const [text, setText] = useState('');
  const [isOpen, setOpen] = useState(false);
  const selectArea = useRef(null);
  const selectList = useRef(null);
  const searchDebounce = useDebounce((value) => {
    searchAction(value);
  }, 500);

  const onChange = (e) => {
    setText(e.target.value);
    if (e.target.value.length >= 3) {
      searchDebounce(e.target.value);
      if (!isOpen) {
        setOpen(true);
      }
    } else {
      if (isOpen) {
        setOpen(false);
      }
    }
  };

  const openSearch = (e) => {
    if (text.length >= 3 && !isOpen) setOpen(true);
  };

  const checkSelect = useCallback(
    (e) => {
      if (!isOpen || !selectArea.current || !selectList.current) return;
      if (
        !selectArea.current.contains(e.target) &&
        !selectList.current.contains(e.target)
      ) {
        setOpen(false);
      }
    },
    [isOpen, setOpen, selectArea, selectList]
  );

  //Control closing Search results
  useEffect(() => {
    window.addEventListener('click', checkSelect);
    return () => {
      window.removeEventListener('click', checkSelect);
    };
  }, [checkSelect]);
  return (
    <div className={classes.searchContainer}>
      <div ref={selectArea} className={classes.search}>
        <input
          className={classes.searchInput}
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={onChange}
          onClick={openSearch}
        />
        <MdSearch className={classes.searchIcon} />
      </div>
      <ul
        ref={selectList}
        style={{ display: isOpen ? '' : 'none' }}
        className={classes.searchResults}
      >
        {loading ? (
          <ListSceleton />
        ) : (
          <Fragment>
            {searchResults.length ? (
              searchResults.map((item, i) =>
                getLink ? (
                  <Link
                    key={`vendor-item-${i}`}
                    className="black-link"
                    to={getLink(item)}
                    onClick={selectAction ? () => selectAction(item) : () => {}}
                  >
                    <li
                      key={`npc-item-${i}`}
                      className={classes.searchResultsRow}
                    >
                      {item}
                    </li>
                  </Link>
                ) : (
                  <li
                    key={`npc-item-${i}`}
                    className={classes.searchResultsRow}
                    onClick={() => selectAction(item)}
                  >
                    {item}
                  </li>
                )
              )
            ) : (
              <li className={classes.searchNoresults}>No results found...</li>
            )}
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default SearchLoading;
