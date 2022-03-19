import React, { Component } from 'react';
import { variables } from './Endpoints.js';
import { Button, Modal, FloatingLabel, Form, Card, Col, Row, Image } from 'react-bootstrap'

export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            products: [],
            productId: 0,
            productDescription: "",
            productName: "",
            productPrice: 0.0,
            categoryId: 0,
            modalTitle: "",
            image: "default.png",
            imagePath: variables.IMAGE_URL,
            modalShow: false,
            validated: false,
            productCategoryFilter:"-1",
            productWithoutFilter:[]
        };


    }


    filterFn(){
        var productCategoryFilter=this.state.productCategoryFilter;
        if (productCategoryFilter == "-1"){
            this.setState({products:this.state.productWithoutFilter});
        }else{
        var filteredProducts=this.state.productWithoutFilter.filter(
            function(p){
                return p.idCategory.toString().toLowerCase().includes(
                    productCategoryFilter.toString().toLowerCase()
                )
            }
        );
        this.setState({products:filteredProducts});
        }
    }


    refresh() {
        fetch(variables.API_URL + "product")
            .then((resp) => resp.json())
            .then(data => {
                this.setState({ products: data, productWithoutFilter:data});
            })
        fetch(variables.API_URL + "category")
            .then((resp) => resp.json())
            .then(data => {
                this.setState({ categories: data});
            })
    }

    componentDidMount() {
        this.refresh();
    }

    changeProductName = (p) => {
        this.setState({ productName: p.target.value });
    }
    changeProductPrice = (p) => {
        this.setState({ productPrice: p.target.value });
    }
    changeProductDescription = (p) => {
        this.setState({ productDescription: p.target.value });
    }
    changeProductCategory = (p) => {
        this.setState({ categoryId: p.target.value });
    }

    changeCategoryFilter = (p) =>{
        this.state.productCategoryFilter=p.target.value;
        this.filterFn();
    }

    imageUpload = (p) => {
        p.preventDefault();

        const formData= new FormData();
        formData.append("file",p.target.files[0],p.target.files[0].name);
        fetch(variables.API_URL+'product/save-image',{
            method: "POST",
            body:formData 
        })
        .then(res => res.json())
        .then((result) => {
            this.setState({image:result});
        })

    }

    updateClick(p) {
        this.setState({
            productId: p.id,
            productDescription: p.description,
            productName: p.name,
            productPrice: p.price,
            categoryId: p.idCategory,
            modalTitle: "Изменить продукт",
            image: p.image,
            modalShow: true
        })
    }
    createClick() {
        this.setState({
            productId: 0,
            productDescription: "",
            productName: "",
            productPrice: 0.0,
            categoryId: this.state.categories[0]?this.state.categories[0].id:0,
            modalTitle: "Создать продукт",
            image: "default.png",
            modalShow: true
        })
    }

    createProduct(){
         
        fetch(variables.API_URL + "product", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.productName,
                description: this.state.productDescription,
                price: parseFloat(this.state.productPrice),
                image: this.state.image,
                idCategory: this.state.categoryId
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refresh();
            }, (error) => {
                alert(error);
            })
        this.setState({ modalShow: false })
    }

    updateProduct() {
        fetch(variables.API_URL + "product", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.state.productId,
                name: this.state.productName,
                description: this.state.productDescription,
                price: parseFloat(this.state.productPrice),
                image: this.state.image,
                idCategory: this.state.categoryId
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refresh();
            }, (error) => {
                alert(error);
            })
        this.setState({ modalShow: false })
    }

    deleteProduct(id) {
        fetch(variables.API_URL + "product/" + id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refresh();
            }, (error) => {
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
            if (this.state.productId == 0){
                this.createProduct();
            }else{
                this.updateProduct();
            }
        }
        this.setState({validated:true});
    
      };

    










    render() {

        const {
            categories,
            products,
            categoryId,
            productName,
            productDescription,
            productPrice,
            image,
            imagePath,
            productId,
            modalShow,
            modalTitle,
            validated,
            productCategoryFilter,
            productWithoutFilter
   
        } = this.state;
        return (
            <div>
           
                <Form.Control className="mb-2 mt-2" as="select" value={parseInt(productCategoryFilter)}
                                    onChange={this.changeCategoryFilter}
                                    >
                                        <option selected value={-1}>Все товары</option>
                                        {categories.map(c =>
                                            <option value={c.id}>{c.name}</option>)}
                                    </Form.Control>
                <Button className="mb-2 me-5" onClick={() => this.createClick()}>Добавить</Button>
              
                <Row xs={1} md={3} className="g-2">
                    {products.map(p =>
                        <Col> <Card >
                            <Card.Img variant="top" src={imagePath+p.image} />
                            <Card.Body>
                                <Card.Title>{p.name}</Card.Title>
                                <Card.Text>
                                    {p.price} руб.
                                </Card.Text>
                                <Card.Text>
                                    {p.description}
                                </Card.Text>
                                <Button className='float-end' disabled={this.state.disable} onClick={() => this.deleteProduct(p.id)} variant="danger">Удалить</Button><Button onClick={() => this.updateClick(p)} variant="info" className='float-end me-2'>Изменить</Button>
                            </Card.Body>
                        </Card>
                        </Col>)}
                </Row>
            


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
                        
                        <Row>
                            <Col>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Название продукта"
                                    className="mb-3"
                                >
                                    <Form.Control required type="text" value={productName}
                                        onChange={this.changeProductName} />
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Описание продукта"
                                    className="mb-3"
                                >
                                    <Form.Control type="text" value={productDescription}
                                        onChange={this.changeProductDescription} />
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Цена продукта"
                                    className="mb-3"
                                >
                                    <Form.Control required type="text" value={productPrice} 
                                        onChange={this.changeProductPrice} />
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Название категории"
                                    className="mb-3"
                                >
                                    <Form.Control as="select" required
                                    onChange={this.changeProductCategory}
                                    value={categoryId}>
                                        {categories.map(c =>
                                            <option value={c.id}>{c.name}</option>)}
                                    </Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <Image fluid src={imagePath+image}></Image>
                                <Form.Group onChange={this.imageUpload} controlId="formFile" className="mb-3">
    <Form.Control type="file" />
  </Form.Group>
                            </Col>
                        </Row>
                        

                    </Modal.Body>
                    <Modal.Footer>
                        {productId == 0 ?
                            <Button type='submit' >Создать</Button> : null}
                        {productId != 0 ?
                            <Button type='submit' >Обновить</Button> : null}
                        <Button className='me-2' onClick={() => this.setState({ modalShow: false })}>Закрыть</Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </div>


        )
    }
}

