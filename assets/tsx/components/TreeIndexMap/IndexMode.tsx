import * as React from "react";
import styled from "styled-components";

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
}

interface IndexModeStateInterface {
    dataSource: string;
}

const maxIndex = 19;

const categories = [
    {
        color: '#C6C6C6',
        title: 'Nedostaju Podaci',
    },
    {
        color: '#67B600',
        title: '1. Klasa',
    },
    {
        color: '#86EC00',
        title: '2. Klasa',
    },
    {
        color: '#FFF058',
        title: '3. Klasa',
    },
    {
        color: '#FFB816',
        title: '4. Klasa',
    },
    {
        color: '#FF4316',
        title: 'Postojeća šuma',
    },
    {
        color: '#FF4316',
        title: 'Zaštićena prirodna dobra',
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

export class IndexMode extends React.Component<IndexModePropsInterface, IndexModeStateInterface> {

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

        return <div className={'d-flex flex-column flex-grow-1'}>
            <div className="alert alert-warning d-flex" style={{alignItems: 'center'}}>
                <i style={{fontSize: 40}} className="fa fa-hand-pointer-o pr-3" aria-hidden="true"/>
                <span style={{fontSize: 14}}>Pomeranjem kursora po mapi pogledajte koliko je određena lokacija povoljna za sadnju drveća.</span>
            </div>
            <div className="flex-grow-1 mb-2">
                <Circle background={category.color}/>
                <p className={'text-center'}>{category.title}</p>
            </div>
            <div>
                <strong className="text-center d-block mb-2">Legenda</strong>
                <div className={'d-flex justify-content-center'}>
                    {[categories[1], categories[2], categories[3], categories[4]].map((category, index) =>
                        <LegendItem key={index}>
                        <LegendCircle background={category.color}/>
                        <p className={'text-muted text-center'}>{category.title}</p>
                    </LegendItem>)}
                </div>
                <div className={'d-flex justify-content-center'}>
                    {[categories[0], categories[5], categories[6]].map((category, index) => <LegendItem key={index}>
                        <LegendCircle background={category.color} />
                        <p className={'text-muted text-center'}>{category.title}</p>
                    </LegendItem>)}
                </div>
            </div>
            <div>
                <strong className="text-center d-block mb-2">Izbor vrste</strong>
                <div className="d-flex">
                    <button className={this.getButtonClass(IndexMode.DATA_PINUS_NIGRA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_PINUS_NIGRA)}
                            data-source="pinus-nigra">
                        <img width="100%" className="mb-2" src={globals.baseUrl + "/public/images/pinus_nigra.svg"}
                             alt={"Pinus nigra"}/>
                        <Title>Crni bor</Title>
                        <LatinTitle>Pinus nigra</LatinTitle>
                    </button>
                    <button className={this.getButtonClass(IndexMode.DATA_QUERCUS_PATRAEA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_QUERCUS_PATRAEA)}
                            data-source="quercus-petraea">
                        <img width="100%" className="mb-2"
                             src={globals.baseUrl + "/public/images/quercus_petraea.svg"} alt={"Quercus petraea"}/>
                        <Title>Hrast kitnjak</Title>
                        <LatinTitle>Quercus petraea</LatinTitle>
                    </button>
                    <button className={this.getButtonClass(IndexMode.DATA_BETULA_PENDULA)}
                            onClick={() => this.props.onDataSourceChange(IndexMode.DATA_BETULA_PENDULA)}
                            data-source="betula-pendula">
                        <img width="100%" className="mb-2" src={globals.baseUrl + "/public/images/betula_pendula.svg"}
                             alt={"Betula pendula"}/>
                        <Title>Breza</Title>
                        <LatinTitle>Betula pendula</LatinTitle>
                    </button>
                </div>
            </div>
            <div className={"mt-2"} style={{fontSize: 12}}>
                <p className={"text-muted"}>*** Algoritam na osnovu kog je izračunata pogodnost za pošumljavanja ne razmatra
                    planska i strateška dokumenta, zbog čega se svim korisnica preporučuje da pre sadnje drveća
                    kontaktiraju nadležne institucije.</p>
                <p className={"text-muted"}>*** <a href={globals.baseUrl + `/download/${this.props.dataSource}`}> Preuzimanje podataka.</a></p>
            </div>
        </div>;
    }
}
