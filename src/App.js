import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

// API credentials
const APP_ID = "a52b4d43";
const APP_KEY = "e0e5c667605f5e91d8275c973531b80a";

// Styled components
const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
  box-shadow: 0 3px 10px 0 #aaa;
`;

const CoverImage = styled.img`
  object-fit: cover;
  height: 200px;
`;

const RecipeName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SeeMoreText = styled.span`
  color: #eb3300;
  font-size: 18px;
  text-align: center;
  border: solid 1px #eb3300;
  border-radius: 3px;
  padding: 10px 15px;
  cursor: pointer;
`;

const IngredientsText = styled(SeeMoreText)`
  color: green;
  border: solid 1px green;
  margin-bottom: 12px;
`;

const SeeNewTab = styled(SeeMoreText)`
  color: green;
  border: solid 1px green;
`;

const RecipeComponent = (props) => {
  const [show, setShow] = useState("");

  const { label, image, ingredients, url } = props.recipe;

  return (
    <RecipeContainer>
      <Dialog
        onClose={() => setShow("")}
        aria-labelledby="simple-dialog-title"
        open={!!show}
      >
        <DialogTitle>Ingredients</DialogTitle>
        <DialogContent>
          <RecipeName>{label}</RecipeName>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.text}</td>
                  <td>{ingredient.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <SeeNewTab onClick={() => window.open(url)}>See More</SeeNewTab>
          <SeeMoreText onClick={() => setShow("")}>Close</SeeMoreText>
        </DialogActions>
      </Dialog>
      <CoverImage src={image} alt={label} />
      <RecipeName>{label}</RecipeName>
      <IngredientsText onClick={() => setShow(label)}>Ingredients</IngredientsText>
      <SeeMoreText onClick={() => window.open(url)}>See Complete Recipe</SeeMoreText>
    </RecipeContainer>
  );
};

// Styled components for App structure
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;

const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const RecipeImage = styled.img`
  width: 36px;
  height: 36px;
  margin: 15px;
`;

const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 200px;
  opacity: 50%;
`;

const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;

const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 20px;
  justify-content: space-evenly;
`;

const AppComponent = () => {
  const [searchQuery, updateSearchQuery] = useState("");
  const [recipeList, updateRecipeList] = useState([]);
  const [timeoutId, updateTimeoutId] = useState();
  const [isLoading, setIsLoading] = useState(false);  // New state for loading

  // Fetch recipes from the API
  const fetchData = async (searchString) => {
    setIsLoading(true); // Set loading to true
    try {
      const response = await Axios.get(
        `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      updateRecipeList(response.data.hits);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  // Handle search query change with debounce
  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  return (
    <Container>
      <Header>
        <AppName>
          <RecipeImage src="/hamburger.svg" />
          Recipe Finder
        </AppName>
        <SearchBox>
          <SearchIcon src="/search-icon.svg" />
          <SearchInput
            placeholder="Search Recipe"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      <RecipeListContainer>
        {isLoading ? (
          <Placeholder src="/hamburger.svg" />
        ) : recipeList?.length ? (
          recipeList.map((recipe, index) => (
            <RecipeComponent key={index} recipe={recipe.recipe} />
          ))
        ) : (
          <Placeholder src="/hamburger.svg" />
        )}
      </RecipeListContainer>
    </Container>
  );
};

export default AppComponent;
