import React, { Component } from 'react';
import { variables } from './Endpoints.js';
import { Button, Table, Modal, FloatingLabel, Form } from 'react-bootstrap'

export class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            categoryId: 0,
            categoryName: "",
            modalTitle: "",
            modalShow: false,
            validated: false
        };


    }


    refresh() {
        fetch(variables.API_URL + "category")
            .then((resp) => resp.json())
            .then(data => {
                this.setState({ categories: data });
            })
    }

    componentDidMount() {
        this.refresh();
    }

    changeCategoryName = (c) => {
        this.setState({ categoryName: c.target.value });
    }

    updateClick(c) {
        this.setState({
            categoryId: c.id,
            categoryName: c.name,
            modalTitle: "Изменить категорию",
            modalShow: true
        })
    }
    createClick() {
        this.setState({
            modalTitle: "Создать категорию",
            modalShow: true,
            categoryId: 0,
            categoryName: ""
        })
    }

    createCategory(){
        fetch(variables.API_URL+"category",{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:this.state.categoryName
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refresh();
        },(error)=>{
            alert(error);
        })
        this.setState({ modalShow: false })
    }

    updateCategory(){
        fetch(variables.API_URL+"category",{
            method:"PUT",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id:this.state.categoryId,
                name:this.state.categoryName
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refresh();
        },(error)=>{
            alert(error);
        })
        this.setState({ modalShow: false })
    }

    deleteCategory(id){
        fetch(variables.API_URL+"category/"+id,{
            method:"DELETE",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refresh();
        },(error)=>{
            alert(error);
        })
        this.setState({ modalShow: false })
    }
    handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }else{
            if (this.state.categoryId == 0){
                this.createCategory();
            }else{
                this.updateCategory();
            }
        }
        this.setState({validated:true});
    
      };








    render() {

        const {
            categories,
            categoryId,
            categoryName,
            modalShow,
            modalTitle,
            validated
        } = this.state;
        return (
            <div>
                <Button className="float-end mb-2 me-5" onClick={() => this.createClick()}>Добавить</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                ID категории
                            </th>
                            <th>
                                Название категории
                            </th>
                            <th>
                                Настройки
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c =>
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td><Button onClick={() => this.updateClick(c)} variant="info" className='me-2'>Изменить</Button><Button onClick={()=>this.deleteCategory(c.id)} variant="danger">Удалить</Button></td>
                            </tr>)}
                    </tbody>
                </Table>


                <Modal
                    show={this.state.modalShow}
                    onHide={() => this.setState({ modalShow: false })}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {modalTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Название категории"
                            className="mb-3"
                        >
                            <Form.Control required type="text" value={categoryName}
                                onChange={this.changeCategoryName} />
                        </FloatingLabel>

                    </Modal.Body>
                    <Modal.Footer>
                        {categoryId == 0 ?
                            <Button type='submit' >Создать</Button> : null}
                        {categoryId != 0 ?
                            <Button type='submit' >Обновить</Button> : null}
                        <Button className='me-2' onClick={() => this.setState({ modalShow: false })}>Закрыть</Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </div>


        )
    }
}

