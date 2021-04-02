import React, { Component } from "react";
import {
  Row,
  Col,
  Layout,
  Form,
  Select,
  message,
  Button,
  Spin,
} from "antd";
import {
  ColorPreview
} from './previews';


import {
  MenuFoldOutlined, MenuUnfoldOutlined, CloseOutlined
} from '@ant-design/icons';

import Navbar from './Navbar';
import ColorPicker from "./ColorPicker";
import darkVars from './dark.json'; // dark变量
import lightVars from './light.json'; // light 变量
import './styles/main.less';

// eslint-disable jsx-a11y/anchor-has-content
const { Footer, Content, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    let initialValue = lightVars;
    let vars = {};
    let themeName =  localStorage.getItem("theme-name") || 'light';

    try {
      vars = localStorage.getItem("app-theme");
      if (!vars) {
        vars = initialValue;
      } else {
        vars = Object.assign(
          {},
          JSON.parse(vars)
        );
      }

    } catch (e) {
      vars = initialValue;
    } finally {
      this.state = {
        themeApplied: false,
        vars, initialValue, size: 'default',
        disabled: false,
        themeName
      }; // 初始设置为light主题
      // 修改加载的less值
      window.less
        .modifyVars(vars)
        .then(() => { 
          this.setState({ themeApplied: true });
        })
        .catch(error => {
          message.error(`Failed to update theme`);
        });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  normFile = e => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  onChangeComplete = (varName, color) => {
    const { vars } = this.state;
    vars[varName] = color;
    this.setState({ vars: { ...vars } });
  };
  handleColorChange = (varname, color) => {
    const vars = { ...this.state.vars };
    if (varname) vars[varname] = color;
    // 覆盖vars色值的数据
    console.log(vars);
    // 重新加载less数据
    window.less
      .modifyVars(vars)
      .then(() => {
        // message.success(`Theme updated successfully`);
        this.setState({ vars });
        localStorage.setItem("app-theme", JSON.stringify(vars));
      })
      .catch(error => {
        message.error(`Failed to update theme`);
      });
  };

  // 颜色选择器
  getColorPicker = (varName, position) => (
    <Row className="color-row" key={`${varName}-${this.state.vars[varName]}`}>
      <Col xs={4} className="color-palette">
        <ColorPicker
          type="sketch"
          small
          color={this.state.vars[varName]}
          position={position || 'right'}
          presetColors={[
            '#F5222D',
            '#FA541C',
            '#FA8C16',
            '#FAAD14',
            '#FADB14',
            '#A0D911',
            '#52C41A',
            '#13C2C2',
            '#1890FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96'
          ]}
          onChangeComplete={color => this.handleColorChange(varName, color)}
        />
      </Col>
      <Col className="color-name" xs={20}>{varName}</Col>
    </Row>
  );
  resetTheme = () => {
    localStorage.setItem("app-theme", "{}");
    localStorage.setItem("theme-name", 'light');
    this.setState({ themeName: 'light' });
    this.setState({ vars: this.state.initialValue });
    window.less.modifyVars(this.state.initialValue).catch(error => {
      message.error(`Failed to reset theme`);
    });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
    console.log('onCollapse', collapsed);
  }

  render() {
    const { collapsed, size, disabled, themeApplied } = this.state;
    const colorPickerOptions = ["@primary-color", "@secondary-color", "@text-color", "@text-color-secondary", "@heading-color", "@layout-header-background", "@btn-primary-bg"]; // 颜色选择器面板修改的变量
    // const colorPickers = Object.keys(this.state.vars).filter(name => colorPickerOptions.indexOf(name) > -1).map((varName, index) =>
    const colorPickers = colorPickerOptions.map((varName, index) =>
      this.getColorPicker(varName, index > 3 ? 'top' : 'right')
    );

    const themeLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };
    if (!themeApplied) {

      return (
        <Spin size="large">
          <Layout className="app" />
        </Spin>
      )
    }
    return (
      <Layout className="app">
        <Navbar />
        <Content className="content">
          <Layout>
            <Sider
              breakpoint="lg"
              collapsedWidth={40}
              collapsed={collapsed}
              width={300}
              onBreakpoint={broken => {
                console.log(broken);
                this.onCollapse(broken);
              }}
              onCollapse={this.onCollapse}
            >
              <Row className="theme-heading">
                {collapsed ? <MenuUnfoldOutlined onClick={() => this.onCollapse(!collapsed)} /> : <MenuFoldOutlined onClick={() => this.onCollapse(!collapsed)} />}
              </Row>
              <Row className="theme-selector-dropdown">
                {!collapsed && (
                  <Col span={22} offset={1}><FormItem
                    {...themeLayout}
                    label="Choose Theme"
                    className="ant-col ant-col-xs-22 ant-col-offset-1 choose-theme"
                  >

                    <Select
                      placeholder="Please select theme"
                      value={this.state.themeName}
                      onSelect={value => {
                        let vars = value === 'light' ? lightVars : darkVars;
                        vars = { ...vars, '@white': '#fff', '@black': '#000' };
                        console.log("----")
                        console.log(vars);
                        console.log(value)
                        this.setState({ vars, themeName: value });
                        localStorage.setItem("app-theme", JSON.stringify(vars));
                        localStorage.setItem("theme-name", value);
                        window.less.modifyVars(vars).catch(error => {
                          
                        });
                      }}
                    >
                      {/* light主题和dark主题 */}
                      <Option value="light">Light</Option>
                      <Option value="dark">Dark</Option>
                    </Select>
                  </FormItem>
                  </Col>
                )}
              </Row>

              {colorPickers}
              <Row type="flex" justify="center">
                <Button type="primary" onClick={this.resetTheme} title="Reset Theme">
                  {!collapsed ? "Reset Theme" : <CloseOutlined />}
                </Button>
              </Row>

            </Sider>
            <Content id="preview-content">
              <div className="preview">
                <ColorPreview />
              </div>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design Live Theme ©2018 Created by Zohaib Ijaz (mzohaibqc)
        </Footer>
      </Layout>
    );
  }
}

export default App;
