import React from 'react';
// import rupiahFormat from 'rupiah-format';
import { Container } from 'react-bootstrap'

import NavGuest from '../../components/navbar/NavGuest';
import transformers from '../../assets/Film List/Transformers.jpg'
// import {dataFilms} from '../../dataDummy/dataFilms'

// import { useParams } from 'react-router-dom';

function DetailFilmPage() {
    // let {id} = useParams()
    return (
    <div>
        <NavGuest />
        <Container className='mt-3'>
            <div className='row'>
                <div className='col'>
                    <img src={transformers} alt="Transformers" className="img-detail" />
                </div>    
                <div className='col'>
                    <h2>Transformers</h2>
                    <iframe width="780" height="400" src='https://www.youtube.com/embed/' frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube" />
                    <div>
                        <p className='m-0'>ACTION</p>
                        <p>Rp. 89.000</p>
                        <p>
                            Hold onto your chimichangas, folks. From the studio that brought you all 3 Taken films comes the block-busting, fourth-wall-breaking masterpiece about Marvel Comics’ sexiest anti-hero! Starring God’s perfect idiot Ryan Reynolds and a bunch of other 'actors' DEADPOOL is a giddy slice of awesomeness packed with more twists than Deadpool’s enemies’ intestines and more action than prom night. Amazeballs!
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    </div>
    )
}

export default DetailFilmPage