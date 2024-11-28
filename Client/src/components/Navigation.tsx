import Dropdown from './common/Dropdown'

const Navigation: React.FC = () => {
    return (
        <div className="flex gap-2 ml-8">
            <Dropdown className="dropdown-hover" tabIndex={1} tabName="Home">
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
            </Dropdown>
            <Dropdown className="dropdown-hover" tabIndex={2} tabName="Contact us">
                <li>
                    <a>Item 1</a>
                </li>
                <li>
                    <a>Item 2</a>
                </li>
            </Dropdown>
        </div>
    )
}

export default Navigation
