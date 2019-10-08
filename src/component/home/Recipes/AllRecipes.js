import React, { Component } from 'react';
import axios from "axios";
import Gallery from 'react-grid-gallery';
import RecipeModal from './RecipeModal';



class AllRecipes extends Component {
  state = {
    recipes: [],
    query: "",
    returnedRecipes: []
  }
  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(
      {
        [name]: value
      }
    )
  }
  selectImageHandler = (i) => {
    this.setState({selectedRecipe:this.state.recipes[i]});
    console.log(this.state);
  }
  formChangeHandler = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const image = {...this.state.selectedRecipe};
    image[key] = value;
    this.setState({
      selectedRecipe:image
    });
  }
  fileChangeHandler = (event) => {
    const file = event.target.files[0];
    this.setState({
      file:file
    });
  }
  search = (event) => {
    event.preventDefault();
    axios.get(`http://localhost:8080/recipe/search?recipes=${this.state.query}`, {
    })
      .then(
        (response) => {
          const recipes = response.data;
          if (recipes) {
            this.setState({
              recipes: recipes
            })
          }

        })

  }

  componentDidMount() {
    console.log("Making call")
    axios.get("http://localhost:8080/recipe/allRecipes")
      .then(response => {
        this.setState({
          recipes: response.data
        })
      }).catch(error => {
        console.log("Error finding recipes", error)
      });
  }
  onModalClose = () => {
    this.setState({selectedRecipe:undefined});
  }  

  render() {
    let convertedImages = [];
    if (this.state.recipes.length > 0) {
      for (let i = 0; i < this.state.recipes.length; i++) {
        convertedImages.push({
          src: 'data:image/jpeg;base64,' + this.state.recipes[i].pictureName,
          thumbnail: 'data:image/jpeg;base64,' + this.state.recipes[i].pictureName,
          thumbnailWidth: 500,
          thumbnailHeight: 500,
          thumbnailCaption: <strong className="center">{this.state.recipes[i].recipeName}</strong>
        });

      }
    }

    return (
    <div>
      <div className="color">
    <div className="search-form-wrapper" >
          <div className="input-group md-form form-sm form-2 pl-0">
            <input className="form-control my-0 py-1 red-border background:black;" value={this.state.query} onChange={this.handleInputChange} name="query" type="text" placeholder="Search" aria-label="Search" />
            <div className="input-group-append"></div>
              <button onClick={this.search} className="input-group-text red lighten-3" id="basic-text1"><i className="fas fa-search text-grey"
                aria-hidden="true">Search</i></button>
            </div>
          </div>
        </div>

        <Gallery src={this.state.recipes + this.state.pictureName} thumbnailCaption={this.state.recipeName} onSelectImage={this.selectImageHandler} enableImageSelection={true} images={convertedImages} rowHeight={300} margin={40} />
        {this.state.selectedRecipe !== undefined ? <RecipeModal
          close={this.onModalClose} image={this.state.selectedRecipe}
          formChangeHandler={this.formChangeHandler}
         fileChangeHandler={this.fileChangeHandler} /> : ''}



      </div>





    );
  }
}

export default AllRecipes;