package org.linlinjava.litemall.admin.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CatVo {
    private Integer value = null;
    private String label = null;
    private String keywords = null;
    private List children = null;
}
