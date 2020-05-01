package pers.pete.printer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pers.pete.printer.consts.Const;
import pers.pete.printer.enums.Align;
import pers.pete.printer.pojo.*;
import pers.pete.printer.utils.ResponseUtil;

import java.awt.*;
import java.awt.print.PrinterException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
public class MainController {

    private ThermalPrinter thermalPrinter;

    @Autowired
    public MainController(ThermalPrinter thermalPrinter) {
        this.thermalPrinter = thermalPrinter;
    }

    @PostMapping("/printer")
    public Object print(@RequestBody OrderData order) {
        List<BaseData> list = new ArrayList<>();

        list.add(new WordData("Order No.: "+ order.getOrderNo(), Align.LEFT, Font.BOLD, Const.FONTSIZE_8));
        list.add(new WordData("Order Time.: "+ order.getOrderTime(), Align.LEFT, Font.BOLD, Const.FONTSIZE_8));

        list.add(new TitleData("Recipe"));
        list.add(new LineData(order.getStatus(), false));
        Arrays.stream(order.getItems()).forEach(item ->{
            list.add(new RowData(item.getTitle(), item.getDescription()));
        });
        list.add(new WordData("Total: "+order.getTotal(), Align.RIGHT, Font.ITALIC, Const.FONTSIZE_8));

        try {
            System.out.println(list);
            this.thermalPrinter.print(list);
        } catch (PrinterException e) {
            e.printStackTrace();
        }
        return ResponseUtil.ok();
    }

}
