class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
<style>
      #formContainer {
        margin: auto;
        width: 100%;
        max-width: 600px; /* limits container width */
        padding: 20px 10px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }

      #submitButton {
  padding: 10px 20px;
  border: 1px solid gray;
  border-radius: 10px;
  background: black;
  color: #FFD700;
  cursor: pointer;
  width: 200px;
}

      #commentsHeader {
        margin: 10px 0;
      }

      .formfieldswrapper {
        display: flex;
        flex-direction: column; /* default to column */
        gap: 10px;
      }

      .formfieldswrapper label {
        text-align: left;
        font-weight: bold;
      }

      input, textarea {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }

      textarea {
        resize: vertical;
        height: 80px;
      }
      
      .buttonWrapper {
  text-align: center; /* centers button horizontally */
  margin-top: 20px;
}

      /* Desktop layout */
      @media (min-width: 768px) {
        .formfieldswrapper {
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 20px;
        }

        .formfieldswrapper label {
          flex: 0 0 80px; /* fixed label width */
          margin-top: 10px;
        }

        input, textarea {
          flex: 1 1 auto; /* take remaining space */
        }

        #submitButton {
          flex: 0 0 auto; /* natural size */
          margin-left: 10px;
          margin-top: 25px; /* aligns with inputs */
        }
      }
      </style>
      <div id="formContainer">
        <h4 id="commentsHeader">ADD A COMMENT</h4>
        <div class="formfieldswrapper">
          <p class="marginlessP">Name</p>
          <input id="nameinput" type="text" name="name"/>
          <p class="marginlessP">Comment</p>
          <textarea type="text" id="commentinput" name="comment"></textarea>
         
        </div>
        <div class="buttonWrapper">
  <button id="submitButton" type="submit">Submit</button>
</div>
      </div>
      <div id="loadingScreen" style="display: none;">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    document.getElementById("submitButton").addEventListener('click', this.submitComment); 
  }
  submitComment(){
    event.preventDefault();
    let name = document.getElementById("nameinput").value;
    let comment = document.getElementById("commentinput").value;
    if(!name || !comment) {
      alert("Please provide name and comment");
      return
    }
    else{
      document.getElementById("nameinput").value = "";
      document.getElementById("commentinput").value = "";
      let newComment = {
        comment,name
      }
      let movies = JSON.parse(sessionStorage.getItem("movies"));
      let currentID = document.getElementsByTagName("comment-component")[0].id.replace('comment','');
      let currMovie= movies.find(o=>o.id==currentID);
      let CurrMovieType = currentID.replace(/\d+$/, '');
      if(currMovie?.comments){
        currMovie.comments.push(newComment);
      }
      else{
        currMovie = {
          type:CurrMovieType,
          id: currentID,
          likes:0,
          comments: [newComment]
        }
        movies.push(currMovie);
      }
      sessionStorage.setItem("movies", JSON.stringify(movies));
      submitCommentToDatabase(currentID, currMovie);
    }
  }
}
customElements.define('comment-component', Header);