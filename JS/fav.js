export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = document.querySelector("table tbody");

    this.load();
  }
  load() {
    this.DadosUsers = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.DadosUsers))
  }

  delete(user) {
    const filterDados = this.DadosUsers.filter(
      (dado) => dado.login !== user.login
    );
    this.DadosUsers = filterDados;

    this.update();
    this.save()
  }

  
async add(username){
  try{
const userExists = this.DadosUsers.find(
(dado) => dado.login.toLowerCase( ) === username.toLowerCase()

)
if(userExists){
  throw new Error('Você já adicionou este usuário')
}


  const user = await GithubUser.search(username)
if(user.login === undefined){
  throw new Error('Esse usuário não existe')
}

this.DadosUsers = [user, ...this.DadosUsers]

this.update()
this.save()
  }
  catch(error){
    alert(error.message)
  }
}


}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();
    this.onAddUser()
  }

  onAddUser(){
    const addButton = this.root.querySelector('#search button')

    addButton.addEventListener('click' , () => {
      const username = this.root.querySelector('#search input').value

      this.add(username)
    })

  }

  update() {
    this.notUsers()
    this.removeAllTr();

    this.DadosUsers.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").innerHTML = user.name;
      row.querySelector(".user span").innerHTML = `/${user.login}`;
      row.querySelector(".repositorios").innerHTML = user.public_repos;
      row.querySelector(".seguidores").innerHTML = user.followers;

      row.querySelector(".buttonRemove").onclick = () => {
        const confirmIsOk = confirm("Você deseja remover este usuário?");
        console.log(confirmIsOk);
        if (confirmIsOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <tr>
    <td>
      <div class="user">
        <img src="https://github.com/maykbrito.png" alt="" />
        <a href="" target="blank_"
          ><p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </div>
    </td>
    <td class="repositorios">13423</td>
    <td class="seguidores">12321</td>
    <td><button class="buttonRemove"><i class="ph ph-trash"></i></button></td>
  </tr>
    `;

    return tr;
  }

notUsers(){
  const isNotUser = this.DadosUsers.length === 0

  if(isNotUser){
    document.querySelector('.notfavorites').classList.remove('hide')
  }
  else{
    document.querySelector('.notfavorites').classList.add('hide')
  }
}
}

export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((dados) => dados.json())
      .then((dados) => {
        const { login, name, followers, public_repos } = dados;

        return {
          login: login,
          name: name,
          public_repos: public_repos,
          followers: followers,
        };
      });
  }
}
