import * as React from "react";
import styled from "styled-components";
import { translate } from 'react-polyglot'

const Title = styled.span`
    font-size: 14px;
`;

const LatinTitle = styled.i`
    font-size: 12px;
`;

const Circle = styled.div`
    width: 60px;
    height: 60px;
    margin: 15px auto 15px auto;
    border-radius: 30px;
    background: ${props => props.background};
`;

const LegendCircle = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    margin: auto;
    background: ${props => props.background};
`;

const LegendItem = styled.div`
    font-size: 10px;
    padding: 5px;
    max-width: 60px;
`;

interface IndexModePropsInterface {
    value: number;
    dataSource: string;
    onDataSourceChange: Function;
    t: any;
}

interface IndexModeStateInterface {
    dataSource: string;
}

const maxIndex = 19;

const categories = [
    {
        color: '#C6C6C6',
        title: 'Insufficent data',
    },
    {
        color: '#67B600',
        title: '1. Class',
    },
    {
        color: '#86EC00',
        title: '2. Class',
    },
    {
        color: '#FFF058',
        title: '3. Class',
    },
    {
        color: '#FFB816',
        title: '4. Class',
    },
    {
        color: '#FF4316',
        title: 'Existing forest',
    },
    {
        color: '#FF4316',
        title: 'Protected natural area',
    }
];

// 1 - 1. klasa : Ovo je lokacija izuzetno pogodna za sadnju ove vrste.
// 2 - 2.  klasa: Ovo je lokacija koja je pogodna za sadnju ove vrste.
// 3 - 3.  klasa: Ovo je lokacija koja je delimično/uslovno pogodna za sadnju ove vrste.
// 4 - 4. klasa: Ovo je lokacija koja nije pogodna za sadnju ove vrste.
// 5 - : Na ovoj lokaciji je već šuma
// 6 - : Ovo je lokacija koja se nalazi u okviru zaštićenog područja (nemojte saditi drvo).

export const getCategory = (index) => {
    return categories[index] || categories[0];
};

class IndexMode extends React.Component<IndexModePropsInterface, IndexModeStateInterface> {

    public static DATA_BETULA_PENDULA = 'betula-pendula';
    public static DATA_QUERCUS_PATRAEA = 'quercus-petraea';
    public static DATA_PINUS_NIGRA = 'pinus-nigra';

    getButtonClass = (dataSource) => {
        let classes = ['btn', 'd-flex', 'flex-column', 'align-items-center'];

        if (dataSource === this.props.dataSource) {
            classes.push('btn-secondary');
        }

        return classes.join(' ');
    };

    constructor(props) {
        super(props);
    }

    render = () => {
        const globals: any = window["globals"];
        const category = getCategory(this.props.value);
        const { t } = this.props;

        return <div className={'d-flex flex-column flex-grow-1'}>
            <div className="d-none d-lg-flex alert alert-warning" style={{alignItems: 'center'}}>
                <i style={{fontSize: 40}} className="fa fa-hand-pointer-o pr-3" aria-hidden="true"/>
                <span style={{fontSize: 14}}>{ t('index-info') }</span>
            </div>
            <div className="flex-grow-1 mb-2">
                <Circle background={category.color}/>
                <p className={'text-center'}>{ t(category.title) }</p>
            </div>
            <div>
                <strong className="text-center d-block mb-2">{ t('legend') }</strong>
                <div className={'d-flex justify-content-center'}>
                    {[categories[1], categories[2], categories[3], categories[4]].map((category, index) =>
                        <LegendItem key={index}>
                        <LegendCircle background={category.color}/>
                        <p className={'text-muted text-center'}>{ t(category.title) }</p>
                    </LegendItem>)}
                </div>
                <div className={'d-flex justify-content-center'}>
                    {[categories[0], categories[5], categories[6]].map((category, index) => <LegendItem key={index}>
                        <LegendCircle background={category.color} />
                        <p className={'text-muted text-center'}>{ t(category.title) }</p>
                    </LegendItem>)}
                </div>
            </div>
            <div>
                <strong className="text-center d-block mb-2">{ t('select-type')}</strong>
                <div className="d-flex">
                    <button className={this.getButtonClass(IndexMode.DATA_PINUS_NIGRA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_PINUS_NIGRA)}
                            data-source="pinus-nigra">
                        <img width="100%" className="mb-2" src={globals.baseUrl + "/public/images/pinus_nigra.svg"}
                             alt={"Pinus nigra"}/>
                        <Title>{t('Pinus nigra')}</Title>
                        <LatinTitle>Pinus nigra</LatinTitle>
                    </button>
                    <button className={this.getButtonClass(IndexMode.DATA_QUERCUS_PATRAEA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_QUERCUS_PATRAEA)}
                            data-source="quercus-petraea">
                        <img width="100%" className="mb-2"
                             src={globals.baseUrl + "/public/images/quercus_petraea.svg"} alt={"Quercus petraea"}/>
                        <Title>{t('Quercus petraea')}</Title>
                        <LatinTitle>Quercus petraea</LatinTitle>
                    </button>
                    <button className={this.getButtonClass(IndexMode.DATA_BETULA_PENDULA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_BETULA_PENDULA)}
                            data-source="betula-pendula">
                        <img width="100%" className="mb-2" src={globals.baseUrl + "/public/images/betula_pendula.svg"}
                             alt={"Betula pendula"}/>
                        <Title>{t('Betula pendula')}</Title>
                        <LatinTitle>Betula pendula</LatinTitle>
                    </button>
                </div>
            </div>
        </div>;
    }
}

export default translate()(IndexMode);