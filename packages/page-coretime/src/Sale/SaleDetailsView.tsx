import { styled } from "@polkadot/react-components";
import { PhaseName } from "../constants.js";
import PhaseTable from "./PhaseTable.js";
import { ChainName, SaleParameters } from "../types.js";
import { SubScanButton } from "./SubScanButton.js";

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Title = styled.h3`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const LinkWithLogo = ({ href, logo, alt }: { href: string, logo: string, alt: string }) => {
    return (
        <a href={href} rel='noopener noreferrer' target='_blank'><img alt={alt} height={25} src={logo} /></a>
    )
}

const providers = {
    regionx: {
        href: 'https://app.regionx.tech/?network=${chainName}',
        logo: 'https://app.regionx.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.8f0fd171.png&w=3840&q=75',
        alt: 'RegionX'
    },
    subscan: {
        href: 'https://coretime-${chainName}.subscan.io/coretime_dashboard',
        logo: 'https://www.subscan.io/_next/image?url=%2Fwebsite%2Flogo-light.png&w=256&q=75',
        alt: 'Subscan'
    },
    lastic: {
        href: 'https://www.lastic.xyz/${chainName}/bulkcore1',
        logo: 'https://www.lastic.xyz/_next/image?url=%2Fassets%2FImages%2FLogos%2Flastic-logo.png&w=384&q=100',
        alt: 'Lastic'
    }
}

const phases = {
    [PhaseName.Renewals]: {
        name: 'Interlude/Renewals phase',
        description: 'In this phase, core owners can renew existing cores at a fixed price to ensure continued operation in the next region. No new core purchases are permitted.'
    },
    [PhaseName.PriceDiscovery]: {
        name: 'Price Discovery phase',
        description: 'The period during which cores are available for both purchase and renewal. The price is linearly declining price.'
    },
    [PhaseName.FixedPrice]: {
        name: 'Fixed price phase',
        description: 'The period during which cores are available for both purchase and renewal. The price is fixed price towards the end of the sales period.'
    }
}

const SaleDetailsView = ({ saleParams, chosenSaleNumber, chainName }: { saleParams: SaleParameters, chosenSaleNumber: number, chainName: ChainName }) => {

    if (chosenSaleNumber === -1 || !saleParams) {
        return null;
    }

    return (
        <ResponsiveContainer>
            <div>
                <Title>Sale #{chosenSaleNumber + 1} phases</Title>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateRows: '1fr 1fr 1fr', minWidth: '200px' }}>
                    {Object.entries(phases).map(([phase, { name, description }]) => (
                        <div>
                            <h4>{name}</h4>
                            <p style={{ maxWidth: '600px', opacity: '0.8' }}>{description}</p>
                            {saleParams?.phaseConfig &&
                                <PhaseTable
                                    phaseInfo={saleParams?.phaseConfig.config[phase as keyof typeof saleParams.phaseConfig.config]}
                                />}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Title>Sale #{chosenSaleNumber + 1} Transactions</Title>
                <SubScanButton chosenSaleNumber={chosenSaleNumber} currentRegion={saleParams.currentRegion} chainName={chainName} />

                <Title>Region for sale #${chosenSaleNumber + 1} </Title>
                <p style={{ maxWidth: '600px', opacity: '0.8' }}>Region is an asset of Coretime. It signifies the upcoming sales period within which a core can be secured by purchasing coretime. Acquiring coretime grants access to a core for the duration of that specific region.</p>
                {saleParams?.regionForSale && <PhaseTable phaseInfo={saleParams?.regionForSale} />}

                <Title>Coretime providers</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem' }}>
                    {Object.entries(providers).map(([provider, { href, logo, alt }]) => (
                        <LinkWithLogo href={href} logo={logo} alt={alt} />
                    ))}
                </div>
            </div>
        </ResponsiveContainer>
    )
};



export default SaleDetailsView;