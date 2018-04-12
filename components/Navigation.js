import { Menu, Input, Form } from 'semantic-ui-react'

const Navigation = ({ account, onAccountChange, onSubmit }) => (
  <Menu>
    <Menu.Item header>Resteem.review</Menu.Item>
    <Menu.Item name="Analyze your favorite resteem service" disabled />
    <Menu.Item position='right'>
      <Form onSubmit={onSubmit} widths="one">
        <Input
          action={{ type: 'submit', content: 'Go', onClick: onSubmit }}
          placeholder='Steem account name'
          onChange={e => onAccountChange(e.target.value)}
          value={account}
          style={{
            width: 'calc(100% - 58px)'
          }}
        />
      </Form>
    </Menu.Item>
  </Menu>
)

export default Navigation
