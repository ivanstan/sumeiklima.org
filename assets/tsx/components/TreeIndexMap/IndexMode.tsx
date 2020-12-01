import * as React from "react";
import styled from "styled-components";
import { translate } from 'react-polyglot'

const Title = styled.span`
    font-size: 14px;
`;

const LatinTitle = styled.i`
    font-size: 12px;
`;

const LegendCircle = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 20px;
    background: ${props => props.background};
    
    @media (max-width: 767.98px) {
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }
`;

const LegendItem = styled.div`
    font-size: 10px;
    padding: 5px;
    display: flex;
    align-items: center;
    
    @media (max-width: 767.98px) {
        padding: 2px;
    }
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

const categories = [
    {
        color: '#C6C6C6',
        title: 'Insufficient data',
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

class IndexMode extends React.Component<IndexModePropsInterface, IndexModeStateInterface> {

    public static DATA_BETULA_PENDULA = 'betula-pendula';
    public static DATA_QUERCUS_PATRAEA = 'quercus-petraea';
    public static DATA_PINUS_NIGRA = 'pinus-nigra';
    public static DATA_QUERCUS_CERRIS = 'quercus-cerris';
    public static DATA_ACER_PSEUDOPLATANUS = 'acer-pseudoplatanus';
    public static DATA_TILIA_TOMENTOSA = 'tilia-tomentosa';

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
        const { t } = this.props;

        return <div className={'d-flex flex-column flex-grow-1'}>
            <div className="flex-grow-1 mb-2"/>
            <div>
                <strong className="text-center d-block mb-2">{t('legend')}</strong>
                <div className={'d-flex flex-column justify-content-center'}>
                    {categories.map((category, index) =>
                        <LegendItem key={index}>
                            <LegendCircle background={category.color} className="legend-circle"/>
                            <p className="mb-0" style={{fontSize: 12}}>{t(category.title)}</p>
                        </LegendItem>)
                    }
                </div>
            </div>
            <div className="flex-grow-1 mb-2"/>
            <div>
                <strong className="text-center d-block mb-2">{t('select-type')}</strong>
                <div className="d-flex justify-content-sm-around">
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_PINUS_NIGRA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_PINUS_NIGRA)}
                    >
                        <img width="81" height="41" className="mb-2" src={globals.baseUrl + "/public/images/pinus_nigra.svg"}
                             alt={"Pinus nigra"}/>
                        <Title>{t('Pinus nigra')}</Title>
                        <LatinTitle>Pinus nigra</LatinTitle>
                    </button>
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_QUERCUS_PATRAEA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_QUERCUS_PATRAEA)}
                    >
                        <img width="81" height="41" className="mb-2"
                             src={globals.baseUrl + "/public/images/quercus_petraea.svg"} alt={"Quercus petraea"}/>
                        <Title>{t('Quercus petraea')}</Title>
                        <LatinTitle>Quercus petraea</LatinTitle>
                    </button>
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_BETULA_PENDULA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_BETULA_PENDULA)}
                    >
                        <img width="81" height="41" className="mb-2" src={globals.baseUrl + "/public/images/betula_pendula.svg"}
                             alt={"Betula pendula"}/>
                        <Title>{t('Betula pendula')}</Title>
                        <LatinTitle>Betula pendula</LatinTitle>
                    </button>
                </div>
                <div className="d-flex justify-content-sm-around">
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_QUERCUS_CERRIS)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_QUERCUS_CERRIS)}
                    >
                        <img width="81" height="41" className="mb-2" src={globals.baseUrl + "/public/images/oak.svg"}
                             alt={"Quercus Cerris"}/>
                        <Title>{t('Quercus Cerris')}</Title>
                        <LatinTitle>Quercus-Cerris</LatinTitle>
                    </button>
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_ACER_PSEUDOPLATANUS)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_ACER_PSEUDOPLATANUS)}
                    >
                        <img width="81" height="41" className="mb-2" src={globals.baseUrl + "/public/images/maple.svg"}
                             alt={"Acer Pseudoplatanus"}/>
                        <Title>{t('Acer Pseudoplatanus')}</Title>
                        <LatinTitle>Acer Pseudoplatanus</LatinTitle>
                    </button>
                    <button style={{width: 107}}className={this.getButtonClass(IndexMode.DATA_TILIA_TOMENTOSA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_TILIA_TOMENTOSA)}
                    >
                        <img width="81" height="41" className="mb-2" src={globals.baseUrl + "/public/images/betula_pendula.svg"}
                             alt={"Tilia Tomentosa"}/>
                        <Title>{t('Tilia Tomentosa')}</Title>
                        <LatinTitle>Tilia Tomentosa</LatinTitle>
                    </button>
                </div>
            </div>
        </div>;
    }
}

export default translate()(IndexMode);